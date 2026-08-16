"use client";

import { motion } from "framer-motion";
import FloatingShapes3D from "./FloatingShapes3D";

const SIGNALS = [
  { label: "FERAL HOOD", icon: "🍄" },
  { label: "ON ROBINHOOD", icon: "⚡" },
  { label: "STAY FERAL", icon: "🌿" },
  { label: "FORAGE TOGETHER", icon: "🥕" },
  { label: "NEON GREEN ENERGY", icon: "✨" },
  { label: "WAGMI", icon: "🐾" },
];

export default function SignalRibbon() {
  return (
    <div className="relative w-full overflow-hidden py-8">
      {/* skewed ribbon band */}
      <div className="absolute inset-y-0 left-[-4%] right-[-4%] -skew-y-2 border-y-2 border-[color:var(--color-neon)]/50 bg-gradient-to-r from-[#2a1650] via-[#3a1140] to-[#2a1650]" />

      <FloatingShapes3D count={4} seed={53} minSize={16} maxSize={34} />

      {/* periodic light sweep */}
      <motion.div
        className="absolute inset-y-0 left-[-4%] right-[-4%] -skew-y-2 overflow-hidden"
        aria-hidden
      >
        <motion.div
          className="h-full w-1/4 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          animate={{ x: ["-30vw", "130vw"] }}
          transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
        />
      </motion.div>

      {/* content, counter-skewed so chips stay level */}
      <div className="relative flex flex-wrap items-center justify-center gap-3 px-4 skew-y-2 sm:gap-4">
        {SIGNALS.map((s, i) => (
          <motion.span
            key={s.label}
            initial={{ opacity: 0, scale: 0.7, rotateX: -60 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            animate={{ y: [0, -12, 0], rotateY: [0, 14, -14, 0] }}
            transition={{
              opacity: { duration: 0.4, delay: i * 0.06 },
              scale: { duration: 0.4, delay: i * 0.06 },
              y: {
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              },
              rotateY: {
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              },
            }}
            whileHover={{
              scale: 1.12,
              rotateY: 180,
              transition: { duration: 0.45, ease: "easeInOut" },
            }}
            style={{ transformPerspective: 500 }}
            className="flex items-center gap-2 whitespace-nowrap rounded-full border-2 border-white/15 bg-[color:var(--color-ink-card)]/80 px-4 py-2 font-[family-name:var(--font-baloo)] text-sm font-bold text-white/90 sm:text-base"
          >
            <span>{s.icon}</span>
            {s.label}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
