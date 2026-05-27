"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { profileUpdateSchema } from "@/lib/validations";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function updateProfileAction(
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "غير مصادق." };

  const raw = {
    display_name: String(formData.get("display_name") ?? "").trim(),
    headline: String(formData.get("headline") ?? "").trim(),
    bio: String(formData.get("bio") ?? "").trim(),
    skills: String(formData.get("skills") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    timezone: String(formData.get("timezone") ?? "").trim(),
    weekly_hours_available: formData.get("weekly_hours_available") || undefined,
    hourly_value: formData.get("hourly_value") || undefined,
  };

  const parsed = profileUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "بعض الحقول غير صحيحة.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const d = parsed.data;
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: d.display_name,
      headline: d.headline || null,
      bio: d.bio || null,
      skills: d.skills ?? [],
      timezone: d.timezone || null,
      weekly_hours_available:
        typeof d.weekly_hours_available === "number"
          ? d.weekly_hours_available
          : null,
      hourly_value:
        typeof d.hourly_value === "number" ? d.hourly_value : null,
    })
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, error: "تعذّر حفظ التغييرات." };
  }

  revalidatePath("/profile");
  return { ok: true };
}
