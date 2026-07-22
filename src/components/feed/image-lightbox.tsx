"use client";

import { X } from "lucide-react";

export default function ImageLightbox({
  image,
  onClose,
}: {
  image: string | null;
  onClose: () => void;
}) {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 py-8 cursor-zoom-out"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Close full image"
      >
        <X size={20} strokeWidth={2.25} />
      </button>
      <img
        src={image}
        alt="Full size post attachment"
        onClick={(event) => event.stopPropagation()}
        className="max-h-full max-w-full rounded-lg object-contain cursor-default"
      />
    </div>
  );
}
