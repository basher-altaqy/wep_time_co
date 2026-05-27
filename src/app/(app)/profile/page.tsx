import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";

export const metadata = {
  title: "الملف الشخصي",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/profile");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="container-narrow py-8">
      <div className="mb-6">
        <h1 className="heading-display text-3xl font-bold text-ink mb-2">
          الملف الشخصي
        </h1>
        <p className="text-ink-muted">
          هذه المعلومات تظهر للمؤسسين عند مراجعة طلبك.
        </p>
      </div>

      <div className="surface-card p-6 sm:p-8">
        <ProfileForm
          initial={{
            display_name: profile?.display_name ?? "",
            headline: profile?.headline ?? "",
            bio: profile?.bio ?? "",
            skills: profile?.skills ?? [],
            timezone: profile?.timezone ?? "",
            weekly_hours_available:
              profile?.weekly_hours_available?.toString() ?? "",
            hourly_value: profile?.hourly_value?.toString() ?? "",
          }}
        />
      </div>

      <div className="mt-6 surface-card p-5 text-sm text-ink-muted">
        <div className="font-medium text-ink mb-1">البريد الإلكتروني</div>
        <div dir="ltr" className="text-start">
          {user.email}
        </div>
      </div>
    </div>
  );
}
