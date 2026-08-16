"use client";

import { motion } from "framer-motion";
import FloatingShapes3D from "./FloatingShapes3D";

const stats = [
  { label: "Block time", value: "~250ms" },
  { label: "Gas fees", value: "Basically none" },
  { label: "Vibes", value: "Immaculate" },
];

export default function ChainSection() {
  return (
    <section id="chain" className="relative overflow-hidden py-24 sm:py-32">
      <FloatingShapes3D count={5} seed={19} minSize={28} maxSize={70} />

      <div
        className="blob h-[40vw] w-[40vw] left-1/2 top-1/2"
        style={{
          transform: "translate(-50%, -50%)",
          background: "var(--color-neon)",
          opacity: 0.12,
          animation: "blob-drift-a 14s ease-in-out infinite",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotateY: -90 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: "spring", stiffness: 160, damping: 14 }}
          whileHover={{ rotateY: 180 }}
          style={{ transformPerspective: 600 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-[color:var(--color-neon)] bg-[color:var(--color-neon)]/10 text-4xl glow-ring"
        >
          <motion.span
            animate={{ rotate: [0, -12, 12, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
            style={{ display: "inline-block" }}
          >
            ⚡
          </motion.span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="font-[family-name:var(--font-baloo)] text-4xl sm:text-5xl font-bold text-white"
        >
          Powered by{" "}
          <span className="text-[color:var(--color-neon)] text-glow-neon">
            Robinhood
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-5 max-w-xl text-white/65"
        >
          Feral Hood lives natively on Robinhood. Fast, cheap, and built for
          degens who forage first and ask questions later. No bridges, no
          nonsense, just mushrooms moving fast.
        </motion.p>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24, rotateX: -30 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.03, rotateX: 8, rotateY: i % 2 === 0 ? 6 : -6 }}
              style={{ transformPerspective: 800 }}
              className="rounded-2xl border border-[color:var(--color-neon)]/25 bg-[color:var(--color-ink-card)] p-6"
            >
              <div className="font-[family-name:var(--font-baloo)] text-2xl sm:text-3xl font-bold text-[color:var(--color-neon)] text-glow-neon">
                {s.value}
              </div>
              <div className="mt-1 text-sm font-semibold text-white/55">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
