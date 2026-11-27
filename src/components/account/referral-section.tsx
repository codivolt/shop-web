"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";

interface ReferralSectionProps {
  user: { referralCode: string | null; referredBy: string | null };
  applyReferral: (code: string) => void;
}

export function ReferralSection({ user, applyReferral }: ReferralSectionProps) {
  const [code, setCode] = useState("");
  const [inputOpen, setInputOpen] = useState(false);

  return (
    <section className="mt-6 rounded-3xl border border-stone-200/80 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-black text-stone-900">کد رفرال من</h2>
        {!user.referredBy && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setInputOpen(true)}
          >
            اعمال کد معرف
          </Button>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-[11px] text-stone-400">کد referral شما:</span>
        <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">
          <span dir="ltr" className="font-mono font-bold text-brand-700">
            {user.referralCode}
          </span>
          <button
            type="button"
            className="rounded p-1 text-stone-400 hover:text-stone-600"
            onClick={() => {
              navigator.clipboard.writeText(user.referralCode ?? "");
              toast.success("کد کپی شد");
            }}
            title="کپی کد"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="16" height="12" x="2" y="4" rx="2" ry="2" />
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <path d="M12 14l2-2 2 2" />
            </svg>
          </button>
        </div>
      </div>

      {user.referredBy && (
        <p className="mt-3 text-[11px] text-stone-500">
          شما با کد معرف وارد شده‌اید.
        </p>
      )}

      {inputOpen && (
        <div className="mt-4 space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (code.trim()) {
                applyReferral(code.trim().toUpperCase());
                setInputOpen(false);
                setCode("");
              }
            }}
            className="flex gap-2"
          >
            <Input
              id="referral-code"
              label="کد رفرال معرف"
              placeholder="REF12345"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 uppercase"
            />
            <Button type="submit" size="sm">
              اعمال
            </Button>
          </form>
        </div>
      )}
    </section>
  );
}