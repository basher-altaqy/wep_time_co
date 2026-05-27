import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * عميل Supabase للمتصفح (Client Components).
 * يستخدم الـ anon key فقط؛ كل العمليات تمر عبر RLS.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
