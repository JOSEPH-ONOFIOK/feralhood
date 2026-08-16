"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  X_HANDLE,
  followIntentUrl,
  retweetIntentUrl,
  quoteIntentUrl,
} from "@/lib/social";

const TASKS_KEY = "feralhood_quest_tasks";

type TaskId = "follow" | "engage" | "quote";

const TASKS: { id: TaskId; label: string; href: string }[] = [
  { id: "follow", label: `Follow @${X_HANDLE}`, href: followIntentUrl },
  { id: "engage", label: "Like + retweet the pinned post", href: retweetIntentUrl() },
  { id: "quote", label: "Quote the pinned post and tag a friend", href: quoteIntentUrl() },
];

export default function XQuest({
  onReady,
}: {
  onReady: (ready: boolean, username: string | null) => void;
}) {
  const [username, setUsername] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [done, setDone] = useState<Record<TaskId, boolean>>({
    follow: false,
    engage: false,
    quote: false,
  });

  useEffect(() => {
    fetch("/api/auth/x/me")
      .then((r) => r.json())
      .then((data) => setUsername(data.connected ? data.username : null))
      .finally(() => setChecking(false));

    Promise.resolve().then(() => {
      try {
        const stored = localStorage.getItem(TASKS_KEY);
        if (stored) setDone((d) => ({ ...d, ...JSON.parse(stored) }));
      } catch {
        // ignore malformed/unavailable storage
      }
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(done));
  }, [done]);

  const allDone = TASKS.every((t) => done[t.id]);

  useEffect(() => {
    onReady(Boolean(username) && allDone, username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, allDone]);

  async function disconnect() {
    await fetch("/api/auth/x/logout", { method: "POST" });
    setUsername(null);
  }

  const completedCount = (username ? 1 : 0) + TASKS.filter((t) => done[t.id]).length;

  return (
    <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-baloo)] text-lg font-bold text-white">
          Forager&apos;s Quest
        </h3>
        <span className="text-xs font-bold text-white/40">{completedCount}/4</span>
      </div>

      <div className="relative mb-5 h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-[color:var(--color-neon)]"
          animate={{ width: `${(completedCount / 4) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="flex flex-col gap-3">
        {!checking &&
          (username ? (
            <div className="flex items-center justify-between rounded-xl border border-[color:var(--color-neon)]/30 bg-[color:var(--color-neon)]/5 px-4 py-3">
              <span className="text-sm font-bold text-white">
                Connected as{" "}
                <span className="text-[color:var(--color-neon)]">@{username}</span>
              </span>
              <button
                type="button"
                onClick={disconnect}
                className="text-xs font-semibold text-white/40 underline underline-offset-2 hover:text-white/70"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <motion.a
              href="/api/auth/x/login"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-white bg-white px-4 py-3 text-sm font-extrabold text-black transition hover:bg-white/90"
            >
              𝕏 Connect X to start
            </motion.a>
          ))}

        {TASKS.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition ${
              username ? "" : "pointer-events-none opacity-40"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={done[task.id]}
                onChange={(e) => setDone((d) => ({ ...d, [task.id]: e.target.checked }))}
                className="h-4 w-4 accent-[color:var(--color-neon)]"
              />
              <span className="text-sm font-semibold text-white/80">{task.label}</span>
            </div>
            <a
              href={task.href}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 text-xs font-bold text-[color:var(--color-neon-soft)] underline underline-offset-2"
            >
              Open ↗
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
