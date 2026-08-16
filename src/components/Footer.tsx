"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaXTwitter, FaDiscord, FaTelegram } from "react-icons/fa6";
import FloatingShapes3D from "./FloatingShapes3D";

const socials = [
  { icon: FaXTwitter, href: "https://x.com", label: "X" },
  { icon: FaDiscord, href: "https://discord.com", label: "Discord" },
  { icon: FaTelegram, href: "https://telegram.org", label: "Telegram" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0a0514] py-12">
      <FloatingShapes3D count={4} seed={41} minSize={20} maxSize={44} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center"
      >
        <motion.div
          whileHover={{ rotateY: 360 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ transformPerspective: 300 }}
          className="flex items-center gap-2"
        >
          <span className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-[color:var(--color-neon)]/70">
            <Image src="/feralhood-avatar.jpg" alt="Feral Hood" fill sizes="36px" className="object-cover" />
          </span>
          <span className="font-[family-name:var(--font-baloo)] text-lg font-bold text-white">
            Feral<span className="text-[color:var(--color-neon)]">Hood</span>
          </span>
        </motion.div>

        <div className="flex gap-4">
          {socials.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.15, y: -4, rotateY: 180 }}
              whileTap={{ scale: 0.9 }}
              style={{ transformPerspective: 300 }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-[color:var(--color-neon)]/50 hover:text-[color:var(--color-neon)]"
            >
              <s.icon size={16} />
            </motion.a>
          ))}
        </div>

        <p className="max-w-md text-xs text-white/35">
          Feral Hood is a community art &amp; culture project on Robinhood. Nothing
          here is financial advice, so forage responsibly. Not affiliated with
          Robinhood Markets, Inc.
        </p>

        <p className="text-xs text-white/25">
          © {new Date().getFullYear()} Feral Hood. All spores reserved.
        </p>
      </motion.div>
    </footer>
  );
}
