"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { http } from "@/lib/api/client";
import { Modal } from "@/components/ui/modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { Button } from "@/components/ui/button";

type ImageViewerProps = {
  open: boolean;
  onClose: () => void;
  src: string | null | undefined;
  title?: string;
};

export function ImageViewer({ open, onClose, src, title }: ImageViewerProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });
  const translateRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!open || !src) {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        setBlobUrl(null);
      }
      setError(false);
      setLoading(false);
      setScale(1);
      setTranslate({ x: 0, y: 0 });
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    const normalizedSrc = src.replace("/uploads/receipts/", "/files/receipts/");

    async function fetchImage() {
      try {
        const response = await http.get(normalizedSrc, {
          responseType: "blob",
        });
        const blob = new Blob([response.data]);
        const url = URL.createObjectURL(blob);
        if (!cancelled) {
          setBlobUrl(url);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchImage();

    return () => {
      cancelled = true;
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [open, src]);

  const resetTransform = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    translateRef.current = { x: 0, y: 0 };
  }, []);

  const zoomIn = useCallback(() => {
    setScale((s) => Math.min(s + 0.5, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((s) => {
      const next = Math.max(s - 0.5, 0.5);
      if (next <= 1) {
        setTranslate({ x: 0, y: 0 });
        translateRef.current = { x: 0, y: 0 };
      }
      return next;
    });
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale <= 1) return;
    isDraggingRef.current = true;
    startRef.current = { x: e.clientX, y: e.clientY };
    translateRef.current = { ...translate };
    e.preventDefault();
  }, [scale, translate]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current || scale <= 1) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    setTranslate({
      x: translateRef.current.x + dx,
      y: translateRef.current.y + dy,
    });
  }, [scale]);

  const onMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const onMouseLeave = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title={title || "نمایش فیش"} fullScreen={false}>
      <div className="flex flex-col items-center justify-center gap-4 min-h-[300px]">
        {error && (
          <div className="flex flex-col items-center gap-2 text-center text-rose-600">
            <span>عدم امکان نمایش فیش</span>
            <button
              onClick={() => {
                setError(false);
                setLoading(true);
              }}
              className="text-sm font-medium text-brand-700 underline-offset-4 hover:underline"
            >
              دوباره تلاش
            </button>
          </div>
        )}
        {loading && !blobUrl && (
          <div className="flex h-48 w-64 items-center justify-center rounded-xl border border-dashed border-border bg-stone-50 text-stone-400 text-sm">
            در حال بارگذاری...
          </div>
        )}
        {blobUrl && (
          <div
            className="group relative flex items-center justify-center w-full max-h-[70vh]"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
          >
            <img
              src={blobUrl}
              alt={title || "فیش"}
              className="object-contain rounded-xl shadow-lg border border-border cursor-pointer transition-transform duration-200"
              style={{
                transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                transformOrigin: "center",
              }}
              onClick={() => {
                if (scale < 3) zoomIn();
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={zoomOut} disabled={scale <= 0.5}>
                  −
                </Button>
                <Button variant="outline" size="sm" onClick={resetTransform} disabled={scale === 1 && translate.x === 0 && translate.y === 0}>
                  بازنشانی
                </Button>
                <Button variant="outline" size="sm" onClick={zoomIn} disabled={scale >= 3}>
                  +
                </Button>
              </div>
            </div>
          </div>
        )}
        {!blobUrl && !loading && !error && (
          <div className="flex h-48 w-64 items-center justify-center rounded-xl border border-dashed border-border bg-stone-50 text-stone-400 text-sm">
            تصویر در دسترس نیست
          </div>
        )}
      </div>
    </Modal>
  );
}
