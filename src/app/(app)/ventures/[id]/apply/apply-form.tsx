"use client";

import { useState, useTransition } from "react";
import { submitApplicationAction, type ActionResult } from "@/app/actions/application";
import { Button } from "@/components/ui/button";
import {
  Input,
  Textarea,
  Label,
  FieldError,
  FieldHint,
} from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";

type Mode = "capacity" | "outcome";

interface Props {
  ventureId: string;
  ventureSlug: string;
}

export function ApplyForm({ ventureId }: Props) {
  const [mode, setMode] = useState<Mode>("capacity");
  const [links, setLinks] = useState<Array<{ label: string; url: string }>>([]);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);

  function addLink() {
    if (links.length >= 5) return;
    setLinks([...links, { label: "", url: "" }]);
  }
  function removeLink(i: number) {
    setLinks(links.filter((_, idx) => idx !== i));
  }
  function updateLink(i: number, key: "label" | "url", value: string) {
    setLinks(links.map((l, idx) => (idx === i ? { ...l, [key]: value } : l)));
  }

  function handleSubmit(formData: FormData) {
    // Inject mode + links_json before sending
    formData.set("mode", mode);
    formData.set(
      "links_json",
      JSON.stringify(
        links.filter((l) => l.label.trim() && l.url.trim())
      )
    );

    startTransition(async () => {
      const res = await submitApplicationAction(ventureId, formData);
      if (!res.ok) setResult(res);
      // ok=true → redirect happens server-side
    });
  }

  const errors = result && !result.ok ? result.fieldErrors ?? {} : {};

  return (
    <form action={handleSubmit} className="space-y-6">
      {result && !result.ok ? (
        <Alert tone="danger">{result.error}</Alert>
      ) : null}

      {/* Mode selector */}
      <div>
        <Label required>كيف تريد أن تنضم؟</Label>
        <div className="grid sm:grid-cols-2 gap-3 mt-2">
          <ModeOption
            active={mode === "capacity"}
            onClick={() => setMode("capacity")}
            title="بالساعات (Capacity)"
            desc="ألتزم بدور وعدد ساعات أسبوعية."
          />
          <ModeOption
            active={mode === "outcome"}
            onClick={() => setMode("outcome")}
            title="بالمخرج (Outcome)"
            desc="ألتزم بتسليم مخرج محدد بموعد ومعيار قبول."
          />
        </div>
      </div>

      {/* Capacity fields */}
      {mode === "capacity" ? (
        <div className="space-y-5 border-r-2 border-accent ps-4 animate-fade-in">
          <div>
            <Label htmlFor="role" required>
              الدور المقترح
            </Label>
            <Input
              id="role"
              name="role"
              required
              maxLength={100}
              placeholder="مثال: مصمم منتج، مطور Front-end"
              error={!!errors.role}
            />
            <FieldError message={errors.role?.[0]} />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="weekly_hours" required>
                ساعات أسبوعية
              </Label>
              <Input
                id="weekly_hours"
                name="weekly_hours"
                type="number"
                min={1}
                max={60}
                required
                placeholder="مثال: 8"
                error={!!errors.weekly_hours}
              />
              <FieldError message={errors.weekly_hours?.[0]} />
            </div>
            <div>
              <Label htmlFor="availability_start">تاريخ البدء</Label>
              <Input
                id="availability_start"
                name="availability_start"
                type="date"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="hourly_rate_ref">سعر الساعة المرجعي</Label>
            <Input
              id="hourly_rate_ref"
              name="hourly_rate_ref"
              type="number"
              min={0}
              step="0.01"
              placeholder="اختياري — للتقدير فقط"
            />
            <FieldHint>
              هذا للسجل المرجعي. الالتزام المالي يُتفق عليه بشكل منفصل.
            </FieldHint>
          </div>
        </div>
      ) : (
        // Outcome fields
        <div className="space-y-5 border-r-2 border-accent ps-4 animate-fade-in">
          <div>
            <Label htmlFor="deliverable" required>
              المخرج المقترح
            </Label>
            <Textarea
              id="deliverable"
              name="deliverable"
              required
              rows={3}
              maxLength={1500}
              placeholder="ماذا ستُسلّم بالضبط؟"
              error={!!errors.deliverable}
            />
            <FieldError message={errors.deliverable?.[0]} />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="target_date" required>
                تاريخ التسليم
              </Label>
              <Input
                id="target_date"
                name="target_date"
                type="date"
                required
                error={!!errors.target_date}
              />
              <FieldError message={errors.target_date?.[0]} />
            </div>
            <div>
              <Label htmlFor="requested_amount">المقابل المطلوب</Label>
              <Input
                id="requested_amount"
                name="requested_amount"
                type="number"
                min={0}
                step="0.01"
                placeholder="اختياري"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="acceptance_criteria" required>
              معيار القبول
            </Label>
            <Textarea
              id="acceptance_criteria"
              name="acceptance_criteria"
              required
              rows={3}
              maxLength={1500}
              placeholder="كيف نعرف أن المخرج مكتمل ومقبول؟"
              error={!!errors.acceptance_criteria}
            />
            <FieldError message={errors.acceptance_criteria?.[0]} />
          </div>
        </div>
      )}

      {/* Shared */}
      <div>
        <Label htmlFor="what_i_offer" required>
          ماذا تستطيع أن تقدّم؟
        </Label>
        <Textarea
          id="what_i_offer"
          name="what_i_offer"
          required
          rows={4}
          maxLength={1500}
          placeholder="خبراتك، مشاريع سابقة مشابهة، نقاط القوة التي ستضيفها للفريق…"
          error={!!errors.what_i_offer}
        />
        <FieldError message={errors.what_i_offer?.[0]} />
      </div>

      {/* Links */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>روابط أعمالك</Label>
          <button
            type="button"
            onClick={addLink}
            disabled={links.length >= 5}
            className="text-sm text-accent hover:text-accent-hover disabled:opacity-50"
          >
            + إضافة رابط
          </button>
        </div>
        {links.length === 0 ? (
          <FieldHint>اختياري — يمكنك إضافة حتى 5 روابط.</FieldHint>
        ) : (
          <div className="space-y-2">
            {links.map((link, i) => (
              <div key={i} className="flex gap-2 items-start">
                <Input
                  placeholder="الوصف"
                  value={link.label}
                  onChange={(e) => updateLink(i, "label", e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="url"
                  placeholder="https://"
                  dir="ltr"
                  value={link.url}
                  onChange={(e) => updateLink(i, "url", e.target.value)}
                  className="flex-[2] text-start"
                />
                <button
                  type="button"
                  onClick={() => removeLink(i)}
                  className="h-10 w-10 flex items-center justify-center rounded-md text-ink-subtle hover:bg-bg hover:text-danger"
                  aria-label="حذف"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" size="lg" loading={isPending}>
          إرسال الطلب
        </Button>
      </div>
    </form>
  );
}

function ModeOption({
  active,
  onClick,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "text-start rounded-lg border p-4 transition-all " +
        (active
          ? "border-accent bg-accent-soft"
          : "border-border bg-surface hover:border-accent/40")
      }
    >
      <div className="font-medium text-ink mb-1">{title}</div>
      <div className="text-sm text-ink-muted leading-relaxed">{desc}</div>
    </button>
  );
}
