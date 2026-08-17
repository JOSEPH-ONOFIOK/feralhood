"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { characters } from "@/lib/characters";
import TiltCard from "./TiltCard";
import FloatingShapes3D from "./FloatingShapes3D";
import { useAllowlistModal } from "./AllowlistModalContext";

export default function CharacterGallery() {
  const { open } = useAllowlistModal();

  return (
    <section id="hood" className="relative mx-auto max-w-6xl overflow-hidden px-4 py-16 sm:py-32">
      <FloatingShapes3D count={6} seed={11} minSize={26} maxSize={70} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="mb-14 text-center"
      >
        <span className="mb-3 inline-block rounded-full bg-[color:var(--color-hood-pink)]/15 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-[color:var(--color-hood-pink)]">
          The Colony
        </span>
        <h2 className="font-[family-name:var(--font-baloo)] text-4xl sm:text-5xl font-bold text-white">
          Meet the <span className="text-[color:var(--color-neon)] text-glow-neon">Hood</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-white/60">
          Five feral little forest freaks, each brewed with their own chaos.
          More spawn every full moon.
        </p>
      </motion.div>

      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[color:var(--color-ink)] to-transparent sm:hidden"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[color:var(--color-ink)] to-transparent sm:hidden"
        />

        <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
          {characters.map((c, i) => (
            <div
              key={c.slug}
              className={`w-[76vw] shrink-0 snap-center sm:w-auto sm:shrink sm:snap-align-none ${
                i % 3 === 1 ? "mt-9" : i % 3 === 2 ? "mt-4" : "mt-0"
              } sm:mt-0`}
            >
              <motion.article
                initial={{ opacity: 0, y: 40, scale: 0.94, rotateY: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                whileHover={{ y: -10 }}
                style={{ transformPerspective: 1200 }}
                className="group relative"
              >
                <TiltCard className="relative overflow-hidden rounded-3xl border border-white/10 bg-[color:var(--color-ink-card)] card-outline">
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(to top, ${c.color}55, transparent 60%)`,
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-[family-name:var(--font-baloo)] text-2xl font-bold text-white">
                        {c.name}
                      </h3>
                      <motion.span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: c.color, boxShadow: `0 0 12px ${c.color}` }}
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}
                      />
                    </div>
                    <p className="text-sm font-extrabold uppercase tracking-wide" style={{ color: c.color }}>
                      {c.title}
                    </p>
                    <p className="mt-2 text-sm text-white/60">{c.blurb}</p>
                  </div>
                </TiltCard>
              </motion.article>
            </div>
          ))}

          <div
            className={`w-[76vw] shrink-0 snap-center sm:w-auto sm:shrink sm:snap-align-none ${
              characters.length % 3 === 1 ? "mt-9" : characters.length % 3 === 2 ? "mt-4" : "mt-0"
            } sm:mt-0`}
          >
            <motion.article
              initial={{ opacity: 0, y: 40, scale: 0.94, rotateY: 50 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -10, rotateX: 6 }}
              style={{ transformPerspective: 1200 }}
              className="flex h-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-[color:var(--color-neon)]/40 bg-[color:var(--color-neon)]/5 p-8 text-center"
            >
              <span className="text-4xl">🍄</span>
              <h3 className="font-[family-name:var(--font-baloo)] text-2xl font-bold text-white">
                More coming
              </h3>
              <p className="text-sm text-white/60">
                The hood grows every full moon. Join the allowlist to catch the next drop.
              </p>
              <button
                type="button"
                onClick={open}
                className="mt-1 text-sm font-extrabold text-[color:var(--color-neon)] text-glow-neon underline underline-offset-4"
              >
                Get on the list →
              </button>
            </motion.article>
          </div>
        </div>
      </div>
    </section>
  );
}
