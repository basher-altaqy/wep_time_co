"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ventureCreateSchema } from "@/lib/validations";
import { toSlug } from "@/lib/utils";

export type ActionResult =
  | { ok: true; data?: unknown }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createVentureAction(
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "تحتاج لتسجيل الدخول." };
  }

  const raw = {
    title: String(formData.get("title") ?? "").trim(),
    thesis: String(formData.get("thesis") ?? "").trim(),
    problem: String(formData.get("problem") ?? "").trim(),
    target_outcome: String(formData.get("target_outcome") ?? "").trim(),
    stage: String(formData.get("stage") ?? "idea"),
    team_size_target: formData.get("team_size_target") || undefined,
    weekly_hours_expected: formData.get("weekly_hours_expected") || undefined,
    compensation_mode: String(formData.get("compensation_mode") ?? "volunteer"),
    required_skills: String(formData.get("required_skills") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    status: String(formData.get("status") ?? "open"),
  };

  const parsed = ventureCreateSchema.safeParse(raw);
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

  const data = parsed.data;
  const slug = toSlug(data.title);

  const { data: inserted, error } = await supabase
    .from("ventures")
    .insert({
      slug,
      founder_id: user.id,
      title: data.title,
      thesis: data.thesis,
      problem: data.problem || null,
      target_outcome: data.target_outcome || null,
      stage: data.stage,
      team_size_target:
        typeof data.team_size_target === "number"
          ? data.team_size_target
          : null,
      weekly_hours_expected:
        typeof data.weekly_hours_expected === "number"
          ? data.weekly_hours_expected
          : null,
      compensation_mode: data.compensation_mode,
      required_skills: data.required_skills ?? [],
      status: data.status,
    })
    .select("slug")
    .single();

  if (error || !inserted) {
    return { ok: false, error: "تعذّر إنشاء الـ Venture. حاول مرة أخرى." };
  }

  revalidatePath("/ventures");
  redirect(`/ventures/${inserted.slug}`);
}

export async function updateVentureStatusAction(
  ventureId: string,
  status: "draft" | "open" | "closed" | "archived"
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "غير مصادق." };

  const { error } = await supabase
    .from("ventures")
    .update({ status })
    .eq("id", ventureId)
    .eq("founder_id", user.id);

  if (error) {
    return { ok: false, error: "تعذّر تحديث الحالة." };
  }

  revalidatePath("/ventures");
  return { ok: true };
}
