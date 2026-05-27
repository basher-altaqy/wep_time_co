"use client";

import { useState, useTransition } from "react";
import { updateProfileAction, type ActionResult } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import {
  Input,
  Textarea,
  Label,
  FieldError,
  FieldHint,
} from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";

interface Initial {
  display_name: string;
  headline: string;
  bio: string;
  skills: string[];
  timezone: string;
  weekly_hours_available: string;
  hourly_value: string;
}

export function ProfileForm({ initial }: { initial: Initial }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);

  function handleSubmit(formData: FormData) {
    setResult(null);
    startTransition(async () => {
      const res = await updateProfileAction(formData);
      setResult(res);
    });
  }

  const errors = result && !result.ok ? result.fieldErrors ?? {} : {};

  return (
    <form action={handleSubmit} className="space-y-5">
      {result?.ok ? (
        <Alert tone="success">تم حفظ التغييرات.</Alert>
      ) : null}
      {result && !result.ok ? (
        <Alert tone="danger">{result.error}</Alert>
      ) : null}

      <div>
        <Label htmlFor="display_name" required>
          الاسم الظاهر
        </Label>
        <Input
          id="display_name"
          name="display_name"
          required
          minLength={2}
          maxLength={80}
          defaultValue={initial.display_name}
          error={!!errors.display_name}
        />
        <FieldError message={errors.display_name?.[0]} />
      </div>

      <div>
        <Label htmlFor="headline">المسمى الوظيفي المختصر</Label>
        <Input
          id="headline"
          name="headline"
          maxLength={120}
          defaultValue={initial.headline}
          placeholder="مثال: مصممة منتجات رقمية، مطوّر Front-end"
        />
      </div>

      <div>
        <Label htmlFor="bio">نبذة</Label>
        <Textarea
          id="bio"
          name="bio"
          rows={4}
          maxLength={1000}
          defaultValue={initial.bio}
          placeholder="من أنت؟ ما الذي تشتغل عليه عادةً؟"
        />
      </div>

      <div>
        <Label htmlFor="skills">المهارات</Label>
        <Input
          id="skills"
          name="skills"
          defaultValue={initial.skills.join("، ")}
          placeholder="مثال: تصميم منتج، React، تسويق نمو"
        />
        <FieldHint>افصل بفاصلة (،). حتى 20 مهارة.</FieldHint>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="weekly_hours_available">
            ساعات متاحة أسبوعيًا
          </Label>
          <Input
            id="weekly_hours_available"
            name="weekly_hours_available"
            type="number"
            min={0}
            max={80}
            defaultValue={initial.weekly_hours_available}
            placeholder="مثال: 10"
          />
        </div>
        <div>
          <Label htmlFor="hourly_value">قيمة الساعة المرجعية</Label>
          <Input
            id="hourly_value"
            name="hourly_value"
            type="number"
            min={0}
            step="0.01"
            defaultValue={initial.hourly_value}
            placeholder="اختياري — رقم تقريبي"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="timezone">المنطقة الزمنية</Label>
        <Input
          id="timezone"
          name="timezone"
          defaultValue={initial.timezone}
          placeholder="مثال: Africa/Cairo"
          dir="ltr"
          className="text-start"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" size="lg" loading={isPending}>
          حفظ التغييرات
        </Button>
      </div>
    </form>
  );
}
