"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

const COLORS = ["#39ff14", "#ff3ea5", "#3edbf0", "#ffe14d", "#b026ff"];

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export default function FloatingSpores({ count = 26 }: { count?: number }) {
  const spores = useMemo(() => {
    const rand = seededRandom(42);
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: rand() * 100,
      size: 4 + rand() * 10,
      duration: 10 + rand() * 14,
      delay: rand() * 8,
      color: COLORS[Math.floor(rand() * COLORS.length)],
      drift: (rand() - 0.5) * 80,
    }));
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {spores.map((s) => (
        <motion.span
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            bottom: "-5%",
            width: s.size,
            height: s.size,
            background: s.color,
            boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
          }}
          initial={{ y: 0, x: 0, opacity: 0 }}
          animate={{
            y: ["0%", "-120vh"],
            x: [0, s.drift],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
