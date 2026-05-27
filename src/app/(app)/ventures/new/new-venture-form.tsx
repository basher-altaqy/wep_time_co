"use client";

import { useState, useTransition } from "react";
import { createVentureAction, type ActionResult } from "@/app/actions/venture";
import { Button } from "@/components/ui/button";
import {
  Input,
  Textarea,
  Select,
  Label,
  FieldError,
  FieldHint,
} from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";

export function NewVentureForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await createVentureAction(formData);
      if (!res.ok) setResult(res);
      // ok=true → redirect happens server-side
    });
  }

  const errors =
    result && !result.ok ? result.fieldErrors ?? {} : {};

  return (
    <form action={handleSubmit} className="space-y-5">
      {result && !result.ok ? (
        <Alert tone="danger">{result.error}</Alert>
      ) : null}

      <div>
        <Label htmlFor="title" required>
          العنوان
        </Label>
        <Input
          id="title"
          name="title"
          required
          maxLength={120}
          placeholder="مثال: منصة لتسريع إطلاق المتاجر العربية"
          error={!!errors.title}
        />
        <FieldError message={errors.title?.[0]} />
      </div>

      <div>
        <Label htmlFor="thesis" required>
          الأطروحة المختصرة
        </Label>
        <Textarea
          id="thesis"
          name="thesis"
          required
          rows={3}
          maxLength={500}
          placeholder="ما الفكرة باختصار؟ من المستفيد؟ لماذا الآن؟ (20–500 حرف)"
          error={!!errors.thesis}
        />
        <FieldError message={errors.thesis?.[0]} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="stage" required>
            المرحلة
          </Label>
          <Select id="stage" name="stage" defaultValue="idea">
            <option value="idea">فكرة</option>
            <option value="validation">تحقق</option>
            <option value="building">قيد البناء</option>
            <option value="launched">أُطلق</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="compensation_mode" required>
            نمط التعويض
          </Label>
          <Select
            id="compensation_mode"
            name="compensation_mode"
            defaultValue="volunteer"
          >
            <option value="volunteer">تطوع</option>
            <option value="equity">حصص/نسبة</option>
            <option value="cash">نقدي</option>
            <option value="hybrid">هجين</option>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="problem">المشكلة التي تحلّها</Label>
        <Textarea id="problem" name="problem" rows={3} maxLength={1500} />
        <FieldHint>اختياري — يساعد المساهمين على فهم السياق.</FieldHint>
      </div>

      <div>
        <Label htmlFor="target_outcome">النتيجة المستهدفة</Label>
        <Textarea
          id="target_outcome"
          name="target_outcome"
          rows={3}
          maxLength={1500}
        />
        <FieldHint>اختياري — ما الذي يُعد نجاحًا؟</FieldHint>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="team_size_target">حجم الفريق المستهدف</Label>
          <Input
            id="team_size_target"
            name="team_size_target"
            type="number"
            min={2}
            max={20}
            placeholder="مثال: 5"
          />
        </div>
        <div>
          <Label htmlFor="weekly_hours_expected">ساعات متوقعة أسبوعيًا</Label>
          <Input
            id="weekly_hours_expected"
            name="weekly_hours_expected"
            type="number"
            min={1}
            max={60}
            placeholder="مثال: 8"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="required_skills">المهارات المطلوبة</Label>
        <Input
          id="required_skills"
          name="required_skills"
          placeholder="مثال: تصميم منتج، تطوير React، تسويق رقمي"
        />
        <FieldHint>افصل المهارات بفاصلة (،).</FieldHint>
      </div>

      <div>
        <Label htmlFor="status">حالة النشر</Label>
        <Select id="status" name="status" defaultValue="open">
          <option value="open">مفتوحة للانضمام</option>
          <option value="draft">مسودة (لا تظهر للآخرين)</option>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" size="lg" loading={isPending}>
          نشر الفكرة
        </Button>
      </div>
    </form>
  );
}
