"use client";

import { useState, useTransition } from "react";
import { decideApplicationAction } from "@/app/actions/application";
import { Button } from "@/components/ui/button";
import { Textarea, Label } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";

type Mode = "idle" | "accepting" | "rejecting";

export function ApplicationActions({
  applicationId,
}: {
  applicationId: string;
}) {
  const [mode, setMode] = useState<Mode>("idle");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit(decision: "accepted" | "rejected") {
    setError(null);
    startTransition(async () => {
      const res = await decideApplicationAction(
        applicationId,
        decision,
        note.trim() || undefined
      );
      if (!res.ok) setError(res.error);
      else {
        setMode("idle");
        setNote("");
      }
    });
  }

  if (mode === "idle") {
    return (
      <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
        <Button onClick={() => setMode("accepting")}>قبول</Button>
        <Button variant="outline" onClick={() => setMode("rejecting")}>
          رفض
        </Button>
      </div>
    );
  }

  const isAccept = mode === "accepting";

  return (
    <div className="space-y-3 pt-3 border-t border-border">
      {error ? <Alert tone="danger">{error}</Alert> : null}
      <div>
        <Label htmlFor={`note-${applicationId}`}>
          ملاحظة للمتقدم (اختياري)
        </Label>
        <Textarea
          id={`note-${applicationId}`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder={
            isAccept
              ? "مرحبًا بك في الفريق. الخطوات التالية…"
              : "شكرًا على اهتمامك. هذه أسباب القرار…"
          }
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={isAccept ? "primary" : "danger"}
          onClick={() => submit(isAccept ? "accepted" : "rejected")}
          loading={isPending}
        >
          {isAccept ? "تأكيد القبول" : "تأكيد الرفض"}
        </Button>
        <Button variant="ghost" onClick={() => setMode("idle")}>
          إلغاء
        </Button>
      </div>
    </div>
  );
}
