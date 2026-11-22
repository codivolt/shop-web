"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { useIsMobile } from "@/hooks/use-media-query";
import { cn } from "@/lib/cn";
import { ModalHeader } from "./modal-header";
import { ModalSheet } from "./modal-sheet";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  fullScreen = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  fullScreen?: boolean;
}) {
  const isMobile = useIsMobile();
  const [rendered, setRendered] = useState(open);

  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(() => setRendered(true));
      return () => cancelAnimationFrame(frame);
    }

    const timer = window.setTimeout(() => setRendered(false), 320);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open || isMobile) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, isMobile]);

  if (isMobile) {
    return (
      <ModalSheet
        open={open}
        onClose={onClose}
        title={title}
        description={description}
        className={className}
        fullScreen={fullScreen}
      >
        {children}
      </ModalSheet>
    );
  }

  if (!rendered || typeof document === "undefined") return null;

  const closing = !open;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        aria-label="بستن"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-stone-950/55 backdrop-blur-md",
          closing ? "modal-backdrop-out" : "modal-backdrop-in",
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative z-10 max-h-[92vh] w-full overflow-y-auto overscroll-contain rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-stone-900/5 sm:max-w-lg",
          closing ? "modal-panel-out" : "modal-panel-in",
          className,
        )}
      >
        <ModalHeader
          title={title}
          description={description}
          onClose={onClose}
        />
        {children}
      </div>
    </div>,
    document.body,
  );
}
