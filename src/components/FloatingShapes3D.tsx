"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

const COLORS = ["#39ff14", "#ff3ea5", "#3edbf0", "#b026ff", "#ffe14d"];

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export default function FloatingShapes3D({
  count = 6,
  seed = 7,
  minSize = 34,
  maxSize = 96,
}: {
  count?: number;
  seed?: number;
  minSize?: number;
  maxSize?: number;
}) {
  const shapes = useMemo(() => {
    const rand = seededRandom(seed);
    return Array.from({ length: count }).map((_, i) => {
      const size = minSize + rand() * (maxSize - minSize);
      return {
        id: i,
        top: rand() * 100,
        left: rand() * 100,
        size,
        color: COLORS[Math.floor(rand() * COLORS.length)],
        duration: 14 + rand() * 16,
        delay: rand() * 6,
        drift: 20 + rand() * 30,
        square: rand() > 0.5,
      };
    });
  }, [count, seed, minSize, maxSize]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {shapes.map((s) => (
        <motion.div
          key={s.id}
          className="absolute border-2"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            borderRadius: s.square ? "28%" : "9999px",
            borderColor: `${s.color}4d`,
            background: `${s.color}12`,
            transformPerspective: 700,
          }}
          animate={{
            rotateX: [0, 180, 360],
            rotateY: [0, -180, -360],
            y: [0, -s.drift, 0],
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
