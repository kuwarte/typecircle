import { useEffect, useState } from "react";

export function useLightbox() {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    if (!lightboxImage) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxImage(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImage]);

  return {
    lightboxImage,
    openLightbox: setLightboxImage,
    closeLightbox: () => setLightboxImage(null),
  };
}
