"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAllowlistModal } from "./AllowlistModalContext";
import AllowlistForm from "./AllowlistForm";
import FloatingShapes3D from "./FloatingShapes3D";

export default function AllowlistModal() {
  const { isOpen, close } = useAllowlistModal();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-[100] flex justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md [align-items:safe_center]"
        >
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.65, rotateX: -40, y: 80 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.75, rotateX: 25, y: 40 }}
            transition={{ type: "spring", stiffness: 210, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            style={{ transformPerspective: 1600 }}
            className="relative my-8 w-full max-w-2xl overflow-hidden rounded-[2rem] border-2 border-[color:var(--color-neon)]/40 bg-[color:var(--color-ink-card)] shadow-[0_0_140px_rgba(57,255,20,0.25)]"
          >
            {/* Kept sparse and small: this panel is a form, so ambience must
                not compete with the labels sitting above it. */}
            <FloatingShapes3D count={3} seed={29} minSize={18} maxSize={38} />
            <div
              className="blob h-[32vw] w-[32vw] left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
              style={{ background: "var(--color-hood-pink)", opacity: 0.2 }}
            />

            <motion.button
              type="button"
              onClick={close}
              aria-label="Close allowlist"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/60 backdrop-blur transition-colors hover:border-[color:var(--color-neon)]/50 hover:text-[color:var(--color-neon)]"
            >
              ✕
            </motion.button>

            <div className="relative z-10 p-6 sm:p-10">
              <AllowlistForm />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
