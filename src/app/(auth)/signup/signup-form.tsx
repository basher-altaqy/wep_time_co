"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldHint, FieldError } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";

export function SignupForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("كلمتا السر غير متطابقتين.");
      return;
    }

    if (password.length < 8) {
      setError("كلمة السر يجب أن تكون 8 حروف فأكثر.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { display_name: displayName.trim() },
        },
      });

      if (signUpError) {
        const msg = signUpError.message.toLowerCase().includes("already")
          ? "هذا البريد مسجّل بالفعل. جرّب تسجيل الدخول."
          : "تعذّر إنشاء الحساب. حاول لاحقًا.";
        setError(msg);
        return;
      }

      setSuccess(true);
    });
  }

  if (success) {
    return (
      <Alert tone="success">
        تم إنشاء الحساب. تحقق من بريدك الإلكتروني لإكمال التفعيل، ثم
        ادخل من صفحة تسجيل الدخول.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? <Alert tone="danger">{error}</Alert> : null}

      <div>
        <Label htmlFor="display_name" required>
          الاسم الظاهر
        </Label>
        <Input
          id="display_name"
          required
          minLength={2}
          maxLength={80}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <FieldHint>الاسم الذي سيراه باقي المستخدمين.</FieldHint>
      </div>

      <div>
        <Label htmlFor="email" required>
          البريد الإلكتروني
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          dir="ltr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-start"
        />
      </div>

      <div>
        <Label htmlFor="password" required>
          كلمة السر
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          dir="ltr"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="text-start"
        />
        <FieldHint>8 حروف على الأقل.</FieldHint>
      </div>

      <div>
        <Label htmlFor="confirm" required>
          تأكيد كلمة السر
        </Label>
        <Input
          id="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          dir="ltr"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="text-start"
        />
      </div>

      <Button type="submit" size="lg" loading={isPending} className="w-full">
        إنشاء الحساب
      </Button>
    </form>
  );
}
