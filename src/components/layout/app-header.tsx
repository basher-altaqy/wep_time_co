import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/app/actions/auth";

export async function AppHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName = "حسابي";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("user_id", user.id)
      .maybeSingle();
    if (profile?.display_name) displayName = profile.display_name;
  }

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-10">
      <div className="container-app flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/ventures"
            className="heading-display text-xl font-bold text-ink"
          >
            صَفّ
          </Link>
          <nav className="hidden sm:flex items-center gap-1 text-sm">
            <NavLink href="/ventures">الأفكار</NavLink>
            <NavLink href="/applications">طلباتي</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/ventures/new"
            className="hidden sm:inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
          >
            انشر فكرة
          </Link>
          <Link
            href="/profile"
            className="rounded-md px-3 py-2 text-sm text-ink-muted hover:text-ink hover:bg-bg transition-colors"
          >
            {displayName}
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-md px-3 py-2 text-sm text-ink-muted hover:text-danger transition-colors"
            >
              خروج
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2 text-ink-muted hover:text-ink hover:bg-bg transition-colors"
    >
      {children}
    </Link>
  );
}
