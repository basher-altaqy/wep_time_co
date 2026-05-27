import { z } from "zod";

export const ventureStageEnum = z.enum([
  "idea",
  "validation",
  "building",
  "launched",
]);

export const compensationModeEnum = z.enum([
  "equity",
  "cash",
  "hybrid",
  "volunteer",
]);

export const ventureStatusEnum = z.enum([
  "draft",
  "open",
  "closed",
  "archived",
]);

export const ventureCreateSchema = z.object({
  title: z
    .string()
    .min(3, "العنوان قصير جدًا")
    .max(120, "العنوان أطول من اللازم"),
  thesis: z
    .string()
    .min(20, "الأطروحة قصيرة. اكتب على الأقل 20 حرفًا.")
    .max(500, "الأطروحة أطول من اللازم"),
  problem: z.string().max(1500).optional().or(z.literal("")),
  target_outcome: z.string().max(1500).optional().or(z.literal("")),
  stage: ventureStageEnum,
  team_size_target: z
    .union([z.coerce.number().int().min(2).max(20), z.literal("")])
    .optional(),
  weekly_hours_expected: z
    .union([z.coerce.number().int().min(1).max(60), z.literal("")])
    .optional(),
  compensation_mode: compensationModeEnum,
  required_skills: z.array(z.string()).max(15).optional(),
  status: ventureStatusEnum.default("open"),
});

export type VentureCreateInput = z.infer<typeof ventureCreateSchema>;

export const ventureUpdateSchema = ventureCreateSchema.partial();

// ============================================================
// Application
// ============================================================

export const applicationModeEnum = z.enum(["capacity", "outcome"]);

const linksSchema = z
  .array(
    z.object({
      label: z.string().min(1).max(60),
      url: z.string().url("رابط غير صحيح"),
    })
  )
  .max(5)
  .optional();

const baseApplicationSchema = z.object({
  what_i_offer: z
    .string()
    .min(20, "اكتب على الأقل 20 حرفًا عمّا تستطيع تقديمه")
    .max(1500),
  links: linksSchema,
});

export const capacityApplicationSchema = baseApplicationSchema.extend({
  mode: z.literal("capacity"),
  role: z
    .string()
    .min(2, "اكتب الدور المقترح")
    .max(100),
  weekly_hours: z.coerce
    .number()
    .int()
    .min(1, "ساعة على الأقل")
    .max(60, "60 ساعة كحد أقصى"),
  availability_start: z.string().optional().or(z.literal("")),
  hourly_rate_ref: z
    .union([z.coerce.number().min(0), z.literal("")])
    .optional(),
});

export const outcomeApplicationSchema = baseApplicationSchema.extend({
  mode: z.literal("outcome"),
  deliverable: z
    .string()
    .min(10, "صف المخرج المقترح")
    .max(1500),
  target_date: z.string().min(1, "اختر تاريخ التسليم المتوقع"),
  acceptance_criteria: z
    .string()
    .min(10, "اكتب معايير القبول")
    .max(1500),
  requested_amount: z
    .union([z.coerce.number().min(0), z.literal("")])
    .optional(),
});

export const applicationSchema = z.discriminatedUnion("mode", [
  capacityApplicationSchema,
  outcomeApplicationSchema,
]);

export type ApplicationInput = z.infer<typeof applicationSchema>;

// ============================================================
// Profile
// ============================================================

export const profileUpdateSchema = z.object({
  display_name: z.string().min(2, "الاسم قصير").max(80),
  headline: z.string().max(120).optional().or(z.literal("")),
  bio: z.string().max(1000).optional().or(z.literal("")),
  skills: z.array(z.string()).max(20).optional(),
  timezone: z.string().optional().or(z.literal("")),
  weekly_hours_available: z
    .union([z.coerce.number().int().min(0).max(80), z.literal("")])
    .optional(),
  hourly_value: z
    .union([z.coerce.number().min(0), z.literal("")])
    .optional(),
  links: z.record(z.string().url()).optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
