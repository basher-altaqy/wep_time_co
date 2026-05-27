import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

/**
 * يُحدّث جلسة Supabase ويُعيد الـ response بعد تجديد الـ cookies.
 * يجب أن يُستدعى من src/middleware.ts.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // مهم: يجب استدعاء getUser() مباشرة بعد إنشاء العميل
  // وعدم وضع أي logic بينهما، حتى تتجدد الجلسة بشكل صحيح.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isProtectedPage =
    pathname.startsWith("/ventures") ||
    pathname.startsWith("/applications") ||
    pathname.startsWith("/profile");

  // مستخدم غير مصادق يحاول الوصول لصفحة محمية
  if (!user && isProtectedPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // مستخدم مصادق يحاول الوصول لصفحة auth → نوجهه إلى /ventures
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/ventures";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
