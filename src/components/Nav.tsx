"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useAllowlistModal } from "./AllowlistModalContext";

const links = [
  { href: "#hood", label: "The Hood" },
  { href: "#chain", label: "Chain" },
];

export default function Nav() {
  const { open } = useAllowlistModal();

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.1 }}
      className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav className="flex w-full max-w-5xl items-center justify-between rounded-full border border-white/10 bg-[#150c28]/80 px-4 py-2.5 backdrop-blur-lg card-outline">
        <a href="#top" className="flex items-center gap-2 shrink-0">
          <motion.span
            whileHover={{ rotateY: 360 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            style={{ transformPerspective: 300 }}
            className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-[color:var(--color-neon)]/70"
          >
            <Image
              src="/feralhood-avatar.jpg"
              alt="Feral Hood mascot"
              fill
              sizes="36px"
              className="object-cover"
            />
          </motion.span>
          <span className="font-[family-name:var(--font-baloo)] text-base sm:text-lg font-bold tracking-wide text-white">
            Feral<span className="text-glow-neon text-[color:var(--color-neon)]">Hood</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-white/70">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-[color:var(--color-neon)]">
              {l.label}
            </a>
          ))}
        </div>

        <motion.button
          type="button"
          onClick={open}
          whileHover={{ scale: 1.06, rotateX: -8 }}
          whileTap={{ scale: 0.95, rotateX: 0 }}
          style={{ transformPerspective: 400 }}
          className="glow-ring rounded-full bg-[color:var(--color-neon)] px-3 sm:px-4 py-2 text-xs sm:text-sm font-extrabold text-[#0c0618] shadow-lg shrink-0"
        >
          <span className="sm:hidden">Join</span>
          <span className="hidden sm:inline">Join Allowlist</span>
        </motion.button>
      </nav>
    </motion.header>
  );
}
