"use client";

import { useState, useTransition } from "react";
import { withdrawApplicationAction } from "@/app/actions/application";
import { Button } from "@/components/ui/button";

export function WithdrawButton({ applicationId }: { applicationId: string }) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handle() {
    startTransition(async () => {
      const res = await withdrawApplicationAction(applicationId);
      if (!res.ok) {
        setError(res.error);
        setConfirming(false);
      }
    });
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-ink-muted">سحب الطلب؟</span>
        <Button
          variant="danger"
          size="sm"
          onClick={handle}
          loading={isPending}
        >
          نعم، اسحب
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setConfirming(false)}
        >
          إلغاء
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setConfirming(true)}
      >
        سحب الطلب
      </Button>
      {error ? <p className="text-xs text-danger mt-1">{error}</p> : null}
    </div>
  );
}
