"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export default function PageIntro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      Promise.resolve().then(() => setShow(false));
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = previousOverflow;
    }, 1100);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          exit={{ opacity: 0, scale: 1.3 }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-[color:var(--color-ink)]"
        >
          <motion.div
            initial={{ scale: 0, rotateY: -180, opacity: 0 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
            style={{ transformPerspective: 600 }}
            className="relative h-20 w-20 overflow-hidden rounded-full ring-4 ring-[color:var(--color-neon)] glow-ring"
          >
            <Image src="/feralhood-avatar.jpg" alt="" fill sizes="80px" className="object-cover" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="font-[family-name:var(--font-baloo)] text-2xl font-bold tracking-wide text-white"
          >
            Feral<span className="text-[color:var(--color-neon)] text-glow-neon">Hood</span>
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.55, ease: "easeInOut" }}
            className="h-1 w-28 origin-left rounded-full bg-[color:var(--color-neon)]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
