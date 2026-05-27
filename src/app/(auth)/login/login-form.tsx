"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";

interface Props {
  next?: string;
  message?: string;
}

export function LoginForm({ next, message }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        const msg =
          signInError.message.toLowerCase().includes("invalid")
            ? "البريد أو كلمة السر غير صحيحة."
            : "تعذّر تسجيل الدخول. حاول مرة أخرى.";
        setError(msg);
        return;
      }

      router.push(next ?? "/ventures");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message ? <Alert tone="success">{message}</Alert> : null}
      {error ? <Alert tone="danger">{error}</Alert> : null}

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
          autoComplete="current-password"
          required
          minLength={8}
          dir="ltr"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="text-start"
        />
        <div className="mt-2 flex justify-end">
          <Link
            href="#"
            className="text-sm text-ink-muted hover:text-accent"
            aria-disabled
            onClick={(e) => e.preventDefault()}
          >
            نسيت كلمة السر؟ (قريبًا)
          </Link>
        </div>
      </div>

      <Button type="submit" size="lg" loading={isPending} className="w-full">
        تسجيل الدخول
      </Button>
    </form>
  );
}
