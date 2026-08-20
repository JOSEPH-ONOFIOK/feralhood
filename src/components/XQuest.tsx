"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  X_HANDLE,
  QUOTE_TEXT,
  TAG_FRIEND_COUNT,
  followIntentUrl,
  retweetIntentUrl,
  quoteIntentUrl,
  tagIntentUrl,
  isValidXPostUrl,
  postUrlHandle,
} from "@/lib/social";

const STORE_KEY = "feralhood_quest_v2";

type TaskId = "follow" | "engage" | "quote" | "tag";

type Task = {
  id: TaskId;
  label: string;
  href: string;
  /** Tasks that produce a public post must be proven with its link. */
  requiresLink?: boolean;
};

const TASKS: Task[] = [
  { id: "follow", label: `Follow @${X_HANDLE}`, href: followIntentUrl },
  { id: "engage", label: "Like + retweet the pinned post", href: retweetIntentUrl() },
  {
    id: "quote",
    label: `Quote the pinned post with “${QUOTE_TEXT}”`,
    href: quoteIntentUrl(),
    requiresLink: true,
  },
  {
    id: "tag",
    label: `Tag ${TAG_FRIEND_COUNT} friends in the comments`,
    href: tagIntentUrl(),
    requiresLink: true,
  },
];-

const TOTAL_STEPS = TASKS.length + 1; // + connecting X

type LinkState = { ok: boolean; error: string | null };

function checkLink(value: string, username: string | null): LinkState {
  const v = value.trim();
  if (!v) return { ok: false, error: null };
  if (!isValidXPostUrl(v)) {
    return { ok: false, error: "Paste a full X post link (x.com/…/status/…)." };
  }
  const author = postUrlHandle(v);
  if (username && author && author.toLowerCase() !== username.toLowerCase()) {
    return { ok: false, error: `That post is from @${author}, not @${username}.` };
  }
  return { ok: true, error: null };
}

export default function XQuest({
  onReady,
}: {
  onReady: (ready: boolean, username: string | null) => void;
}) {
  const [username, setUsername] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [checks, setChecks] = useState<Partial<Record<TaskId, boolean>>>({});
  const [links, setLinks] = useState<Partial<Record<TaskId, string>>>({});

  useEffect(() => {
    fetch("/api/auth/x/me")
      .then((r) => r.json())
      .then((data) => setUsername(data.connected ? data.username : null))
      .finally(() => setChecking(false));

    Promise.resolve().then(() => {
      try {
        const stored = localStorage.getItem(STORE_KEY);
        if (!stored) return;
        const parsed = JSON.parse(stored);
        if (parsed.checks) setChecks(parsed.checks);
        if (parsed.links) setLinks(parsed.links);
      } catch {
        // ignore malformed/unavailable storage
      }
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify({ checks, links }));
  }, [checks, links]);

  const isDone = (t: Task) =>
    t.requiresLink ? checkLink(links[t.id] ?? "", username).ok : Boolean(checks[t.id]);

  const allDone = TASKS.every(isDone);
  const completedCount = (username ? 1 : 0) + TASKS.filter(isDone).length;

  useEffect(() => {
    onReady(Boolean(username) && allDone, username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, allDone]);

  async function disconnect() {
    await fetch("/api/auth/x/logout", { method: "POST" });
    setUsername(null);
  }

  return (
    <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-baloo)] text-lg font-bold text-white">
          Forager&apos;s Quest
        </h3>
        <span className="text-xs font-bold text-white/40">
          {completedCount}/{TOTAL_STEPS}
        </span>
      </div>

      <div className="relative mb-5 h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-[color:var(--color-neon)]"
          animate={{ width: `${(completedCount / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="flex flex-col gap-3">
        {!checking &&
          (username ? (
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-xl border border-[color:var(--color-neon)]/30 bg-[color:var(--color-neon)]/5 px-4 py-3">
              <span className="text-sm font-bold text-white">
                Connected as{" "}
                <span className="break-all text-[color:var(--color-neon)]">@{username}</span>
              </span>
              <button
                type="button"
                onClick={disconnect}
                className="shrink-0 text-xs font-semibold text-white/40 underline underline-offset-2 hover:text-white/70"
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

        {TASKS.map((task, i) => {
          const value = links[task.id] ?? "";
          const state = checkLink(value, username);
          const complete = isDone(task);

          return (
            <div
              key={task.id}
              className={`rounded-xl border px-4 py-3 transition ${
                complete
                  ? "border-[color:var(--color-neon)]/40 bg-[color:var(--color-neon)]/5"
                  : "border-white/10 bg-white/5"
              } ${username ? "" : "pointer-events-none opacity-40"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  {task.requiresLink ? (
                    <span
                      aria-hidden
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border text-[10px] font-black ${
                        complete
                          ? "border-[color:var(--color-neon)] bg-[color:var(--color-neon)] text-[#0c0618]"
                          : "border-white/25 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                  ) : (
                    <input
                      type="checkbox"
                      aria-label={task.label}
                      checked={Boolean(checks[task.id])}
                      onChange={(e) =>
                        setChecks((c) => ({ ...c, [task.id]: e.target.checked }))
                      }
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--color-neon)]"
                    />
                  )}
                  <span className="text-sm font-semibold text-white/80">
                    <span className="mr-1 text-white/35">{i + 1}.</span>
                    {task.label}
                  </span>
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

              {task.requiresLink && (
                <div className="mt-3 pl-7">
                  <input
                    value={value}
                    onChange={(e) =>
                      setLinks((l) => ({ ...l, [task.id]: e.target.value }))
                    }
                    inputMode="url"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="Paste your post link"
                    aria-invalid={Boolean(state.error)}
                    className={`w-full rounded-lg border bg-black/25 px-3 py-2 font-mono text-xs text-white placeholder:font-sans placeholder:text-white/30 outline-none transition focus:bg-black/40 ${
                      state.error
                        ? "border-[color:var(--color-hood-pink)]/70 focus:border-[color:var(--color-hood-pink)]"
                        : complete
                          ? "border-[color:var(--color-neon)]/50"
                          : "border-white/10 focus:border-[color:var(--color-neon)]"
                    }`}
                  />
                  {state.error && (
                    <p className="mt-1.5 text-xs font-semibold text-[color:var(--color-hood-pink)]">
                      {state.error}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
