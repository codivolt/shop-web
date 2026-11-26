"use client";

import type { ReactNode } from "react";
import { Drawer } from "vaul";

import { cn } from "@/lib/cn";
import { ModalHeader } from "./modal-header";

export function ModalSheet({
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
  return (
    <Drawer.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      dismissible
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md" />
        <Drawer.Content
          aria-label={title}
          aria-describedby={undefined}
          className={cn(
            "fixed inset-x-0 z-50 flex max-h-full flex-col rounded-t-[2rem] border border-white/10 bg-ink-800 shadow-2xl shadow-black/70 outline-none",
            fullScreen ? "top-0 h-full rounded-none" : "bottom-0 max-h-[92vh]",
            className,
          )}
        >
          <div className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-stone-300/80" />
          <div
            className={cn(
              fullScreen
                ? "px-6 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
                : "overflow-y-auto overscroll-contain px-6 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]",
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
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
