"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { applicationSchema } from "@/lib/validations";

export type ActionResult =
  | { ok: true; data?: unknown }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitApplicationAction(
  ventureId: string,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "تحتاج لتسجيل الدخول." };

  // Validate venture exists, is open, and applicant is not founder
  const { data: venture, error: vErr } = await supabase
    .from("ventures")
    .select("id, founder_id, status")
    .eq("id", ventureId)
    .maybeSingle();

  if (vErr || !venture) {
    return { ok: false, error: "الـ Venture غير موجودة." };
  }
  if (venture.founder_id === user.id) {
    return { ok: false, error: "لا يمكنك التقديم على فكرتك." };
  }
  if (venture.status !== "open") {
    return { ok: false, error: "هذه الـ Venture ليست مفتوحة للانضمام." };
  }

  // Check existing pending
  const { data: existing } = await supabase
    .from("applications")
    .select("id")
    .eq("venture_id", ventureId)
    .eq("applicant_id", user.id)
    .eq("status", "pending")
    .maybeSingle();

  if (existing) {
    return {
      ok: false,
      error: "لديك طلب نشط لهذه الـ Venture. يمكنك سحبه أولًا من صفحة طلباتي.",
    };
  }

  const mode = String(formData.get("mode") ?? "");
  const links = parseLinks(String(formData.get("links_json") ?? "[]"));

  const raw: Record<string, unknown> = {
    mode,
    what_i_offer: String(formData.get("what_i_offer") ?? "").trim(),
    links,
  };

  if (mode === "capacity") {
    raw.role = String(formData.get("role") ?? "").trim();
    raw.weekly_hours = formData.get("weekly_hours") || undefined;
    raw.availability_start = String(formData.get("availability_start") ?? "");
    raw.hourly_rate_ref = formData.get("hourly_rate_ref") || undefined;
  } else if (mode === "outcome") {
    raw.deliverable = String(formData.get("deliverable") ?? "").trim();
    raw.target_date = String(formData.get("target_date") ?? "");
    raw.acceptance_criteria = String(
      formData.get("acceptance_criteria") ?? ""
    ).trim();
    raw.requested_amount = formData.get("requested_amount") || undefined;
  }

  const parsed = applicationSchema.safeParse(raw);
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
  const insertPayload: Record<string, unknown> = {
    venture_id: ventureId,
    applicant_id: user.id,
    mode: d.mode,
    what_i_offer: d.what_i_offer,
    links: d.links ?? [],
    status: "pending",
  };

  if (d.mode === "capacity") {
    insertPayload.role = d.role;
    insertPayload.weekly_hours = d.weekly_hours;
    insertPayload.availability_start = d.availability_start || null;
    insertPayload.hourly_rate_ref =
      typeof d.hourly_rate_ref === "number" ? d.hourly_rate_ref : null;
  } else {
    insertPayload.deliverable = d.deliverable;
    insertPayload.target_date = d.target_date;
    insertPayload.acceptance_criteria = d.acceptance_criteria;
    insertPayload.requested_amount =
      typeof d.requested_amount === "number" ? d.requested_amount : null;
  }

  const { error } = await supabase.from("applications").insert(insertPayload);

  if (error) {
    return { ok: false, error: "تعذّر إرسال الطلب. حاول مرة أخرى." };
  }

  revalidatePath("/applications");
  revalidatePath(`/ventures/${ventureId}`);
  redirect("/applications?message=submitted");
}

export async function decideApplicationAction(
  applicationId: string,
  decision: "accepted" | "rejected",
  note?: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "غير مصادق." };

  // RLS will additionally enforce that user is the founder
  const { error } = await supabase
    .from("applications")
    .update({
      status: decision,
      founder_note: note ?? null,
    })
    .eq("id", applicationId)
    .eq("status", "pending");

  if (error) {
    return { ok: false, error: "تعذّر تحديث الحالة." };
  }

  revalidatePath("/ventures");
  return { ok: true };
}

export async function withdrawApplicationAction(
  applicationId: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "غير مصادق." };

  const { error } = await supabase
    .from("applications")
    .update({ status: "withdrawn" })
    .eq("id", applicationId)
    .eq("applicant_id", user.id)
    .eq("status", "pending");

  if (error) {
    return { ok: false, error: "تعذّر سحب الطلب." };
  }

  revalidatePath("/applications");
  return { ok: true };
}

function parseLinks(
  json: string
): Array<{ label: string; url: string }> | undefined {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return undefined;
    return parsed
      .filter(
        (x) =>
          x &&
          typeof x.label === "string" &&
          typeof x.url === "string" &&
          x.label.trim() &&
          x.url.trim()
      )
      .slice(0, 5);
  } catch {
    return undefined;
  }
}
