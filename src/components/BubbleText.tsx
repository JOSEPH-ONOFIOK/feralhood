"use client";

import { motion } from "framer-motion";

type BubbleTextProps = {
  words: string[];
  className?: string;
  neonWords?: number[];
  size?: string;
};

export default function BubbleText({
  words,
  className = "",
  neonWords = [],
  size = "text-[clamp(2.6rem,9vw,7rem)]",
}: BubbleTextProps) {
  return (
    <div className={`flex flex-wrap justify-center gap-x-5 ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={word + i}
          initial={{ opacity: 0, y: 60, rotateX: -100 }}
          animate={{ opacity: 1, y: [0, -10, 0], rotateX: 0 }}
          transition={{
            opacity: { type: "spring", stiffness: 220, damping: 14, delay: i * 0.12 },
            rotateX: { type: "spring", stiffness: 220, damping: 14, delay: i * 0.12 },
            y: {
              duration: 3.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6 + i * 0.12,
            },
          }}
          whileHover={{
            rotateY: [0, -18, 18, 0],
            scale: 1.08,
            transition: { duration: 0.5, ease: "easeInOut" },
          }}
          style={{ transformPerspective: 700 }}
          className={`bubble-text ${size} ${neonWords.includes(i) ? "neon-word" : ""} leading-[0.95]`}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
