"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import BubbleText from "./BubbleText";
import FloatingSpores from "./FloatingSpores";
import FloatingShapes3D from "./FloatingShapes3D";
import { useAllowlistModal } from "./AllowlistModalContext";

const floaters = [
  { src: "/hood-forager.jpg", className: "left-[4%] top-[18%] w-24 sm:w-32 lg:w-40", rotate: -8, duration: 6 },
  { src: "/hood-corsair.jpg", className: "right-[3%] top-[12%] w-24 sm:w-32 lg:w-36", rotate: 10, duration: 7 },
  { src: "/hood-elixir.jpg", className: "left-[8%] bottom-[10%] w-20 sm:w-28 lg:w-32", rotate: 6, duration: 5.5 },
  { src: "/hood-tidal.jpg", className: "right-[7%] bottom-[16%] w-24 sm:w-32 lg:w-40", rotate: -6, duration: 6.5 },
];

export default function Hero() {
  const { open } = useAllowlistModal();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const blobY1 = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const blobY2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const blobY3 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden pt-24"
    >
      {/* ambient blobs, drifting via CSS and nudged by scroll */}
      <motion.div style={{ y: blobY1 }} className="absolute -left-[10vw] top-[6vh] h-[38vw] w-[38vw]">
        <div className="blob h-full w-full bg-[color:var(--color-hood-purple)]" style={{ animation: "blob-drift-a 16s ease-in-out infinite" }} />
      </motion.div>
      <motion.div style={{ y: blobY2 }} className="absolute right-[-6vw] top-[2vh] h-[32vw] w-[32vw]">
        <div className="blob h-full w-full bg-[color:var(--color-hood-pink)]" style={{ animation: "blob-drift-b 18s ease-in-out infinite" }} />
      </motion.div>
      <motion.div style={{ y: blobY3 }} className="absolute left-[30vw] bottom-[-14vh] h-[34vw] w-[34vw]">
        <div className="blob h-full w-full bg-[color:var(--color-neon)]" style={{ animation: "blob-drift-a 20s ease-in-out infinite reverse" }} />
      </motion.div>

      <FloatingShapes3D count={7} seed={3} minSize={30} maxSize={80} />
      <FloatingSpores />

      {floaters.map((f, i) => (
        <motion.div
          key={f.src}
          className={`absolute z-10 hidden sm:block ${f.className}`}
          initial={{ opacity: 0, scale: 0.6, rotate: f.rotate * 2 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: [f.rotate, -f.rotate, f.rotate],
            rotateY: [0, 25, -25, 0],
            y: [0, -18, 0],
          }}
          whileHover={{
            scale: 1.15,
            rotate: 0,
            rotateY: 0,
            transition: { duration: 0.25 },
          }}
          transition={{
            opacity: { duration: 0.6, delay: 0.3 + i * 0.15 },
            scale: { duration: 0.6, delay: 0.3 + i * 0.15 },
            rotate: { duration: f.duration, repeat: Infinity, ease: "easeInOut" },
            rotateY: { duration: f.duration * 1.4, repeat: Infinity, ease: "easeInOut" },
            y: { duration: f.duration, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{ transformPerspective: 900 }}
        >
          <div className="relative aspect-square overflow-hidden rounded-3xl glow-ring">
            <Image src={f.src} alt="" fill sizes="200px" className="object-cover" />
          </div>
        </motion.div>
      ))}

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 flex flex-col items-center px-4 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -30, rotate: -20 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 10, delay: 0.05 }}
          className="mb-7 flex flex-col items-center"
        >
          <span className="h-5 w-px bg-white/25" />
          <span className="-mt-px h-1.5 w-1.5 rounded-full border border-white/40" />
          <motion.span
            animate={{ rotate: [-4, 4, -4], rotateY: [0, 16, 0, -16, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "top center", transformPerspective: 500 }}
            className="-mt-1 flex items-center gap-2 rounded-2xl border-2 border-[color:var(--color-neon)] bg-[color:var(--color-ink-card)] px-4 py-2 text-xs sm:text-sm font-extrabold tracking-wide text-[color:var(--color-neon-soft)] text-glow-neon glow-ring"
          >
            🍄 Brewing on Robinhood
          </motion.span>
        </motion.div>

        <BubbleText words={["FERAL"]} neonWords={[]} />
        <BubbleText words={["HOOD"]} neonWords={[0]} className="-mt-2 sm:-mt-4" />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-6 max-w-xl text-balance text-base sm:text-lg text-white/75"
        >
          A colony of feral little mushroom critters squatting on the fastest, cutest
          corner of <span className="font-extrabold text-white">Robinhood</span>. Foraged,
          fermented, and ready to go feral together.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.button
            type="button"
            onClick={open}
            whileHover={{ scale: 1.06, rotateX: -10, rotateY: 6 }}
            whileTap={{ scale: 0.94, rotateX: 0, rotateY: 0 }}
            style={{ transformPerspective: 500 }}
            className="glow-ring rounded-full bg-[color:var(--color-neon)] px-7 py-3.5 text-base font-extrabold text-[#0c0618] shadow-xl"
          >
            🍄 Join the Allowlist
          </motion.button>
          <motion.a
            href="#hood"
            whileHover={{ scale: 1.06, rotateX: -10, rotateY: -6 }}
            whileTap={{ scale: 0.94, rotateX: 0, rotateY: 0 }}
            style={{ transformPerspective: 500 }}
            className="rounded-full border-2 border-white/20 bg-white/5 px-7 py-3.5 text-base font-extrabold text-white backdrop-blur"
          >
            Meet the Hood
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 z-20 text-white/40"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </section>
  );
}
