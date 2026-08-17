"use client";

import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "./CountUp";
import XQuest from "./XQuest";

type Status = "idle" | "loading" | "success" | "error" | "duplicate";

const WALLET_RE = /^0x[a-fA-F0-9]{40}$/;

export default function AllowlistForm() {
  const [xUsername, setXUsername] = useState<string | null>(null);
  const [questReady, setQuestReady] = useState(false);
  const [wallet, setWallet] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [position, setPosition] = useState<number | null>(null);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/allowlist")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && typeof data.count === "number") setCount(data.count);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!xUsername || !wallet.trim() || !inviteCode.trim()) {
      setStatus("error");
      setMessage("Fill in every field. The mushrooms are picky.");
      return;
    }
    if (!WALLET_RE.test(wallet.trim())) {
      setStatus("error");
      setMessage("That doesn't look like a valid wallet address (0x...).");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/allowlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: `@${xUsername}`,
          wallet: wallet.trim(),
          inviteCode: inviteCode.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok || data.error === "duplicate") {
        setStatus(data.error === "duplicate" ? "duplicate" : "error");
        setMessage(
          data.error === "duplicate"
            ? "That wallet's already foraging in the hood."
            : data.error || "Something went wrong. Try again in a bit."
        );
        return;
      }

      setStatus("success");
      setPosition(data.position ?? null);
      setCount((c) => (typeof c === "number" ? c + 1 : c));
    } catch {
      setStatus("error");
      setMessage("Couldn't reach the hood. Check your connection and retry.");
    }
  }

  const isDone = status === "success" || status === "duplicate";
  const view = isDone ? "done" : questReady ? "form" : "locked";

  return (
    <div>
      <div className="text-center">
        <span className="text-4xl">🥕</span>
        <h2 className="mt-3 font-[family-name:var(--font-baloo)] text-3xl sm:text-4xl font-bold text-white">
          Join the{" "}
          <span className="text-[color:var(--color-neon)] text-glow-neon">Allowlist</span>
        </h2>
        <p className="mt-3 text-white/60">
          Complete the quest, then drop your wallet and invite code. First come, first foraged.
        </p>
        {typeof count === "number" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 inline-block rounded-full bg-white/5 px-4 py-1 text-sm font-bold text-[color:var(--color-neon-soft)]"
          >
            <CountUp value={count} /> {count === 1 ? "critter" : "critters"} already in the
            hood
          </motion.p>
        )}
      </div>

      {!isDone && (
        <div className="mt-8">
          <XQuest
            onReady={(ready, username) => {
              setQuestReady(ready);
              setXUsername(username);
            }}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {view === "done" ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-[color:var(--color-neon)]/40 bg-[color:var(--color-neon)]/10 px-6 py-8 text-center"
            >
              <motion.span
                initial={{ scale: 0, rotateY: -180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.1 }}
                style={{ transformPerspective: 400, display: "inline-block" }}
                className="text-5xl"
              >
                {status === "success" ? "🍄" : "🌿"}
              </motion.span>
              <p className="font-[family-name:var(--font-baloo)] text-xl font-bold text-white">
                {status === "success" ? "You're in the hood!" : "Already in the hood!"}
              </p>
              <p className="text-sm text-white/60">
                {status === "success" && position
                  ? `You're forager #${position}. Watch your DMs for the drop.`
                  : message || "That wallet is already on the list. Sit tight."}
              </p>
            </motion.div>
          ) : view === "locked" ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-8 text-center text-sm text-white/40"
            >
              🔒 Finish the quest above to unlock the wallet form.
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-4"
            >
              <p className="-mt-1 text-xs font-semibold text-white/40">
                Submitting as{" "}
                <span className="font-bold text-[color:var(--color-neon-soft)]">
                  @{xUsername}
                </span>
              </p>
              <Field
                label="Wallet address"
                placeholder="0x..."
                value={wallet}
                onChange={setWallet}
                mono
              />
              <Field
                label="Invite code"
                placeholder="FERAL-XXXX"
                value={inviteCode}
                onChange={setInviteCode}
              />

              <AnimatePresence>
                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm font-bold text-[color:var(--color-hood-pink)]"
                  >
                    {message}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={status === "loading"}
                whileHover={{ scale: status === "loading" ? 1 : 1.03, rotateX: status === "loading" ? 0 : -6 }}
                whileTap={{ scale: status === "loading" ? 1 : 0.96, rotateX: 0 }}
                style={{ transformPerspective: 500 }}
                className="glow-ring mt-2 rounded-full bg-[color:var(--color-neon)] px-6 py-4 text-base font-extrabold text-[#0c0618] shadow-xl disabled:opacity-60"
              >
                {status === "loading" ? "Forwarding to the hood…" : "Join the Allowlist"}
              </motion.button>
            </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  mono = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  mono?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      <span className="text-xs font-extrabold uppercase tracking-widest text-white/50">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/30 outline-none transition focus:border-[color:var(--color-neon)] focus:bg-white/10 focus:ring-2 focus:ring-[color:var(--color-neon)]/40 ${mono ? "font-mono text-sm" : ""}`}
      />
    </label>
  );
}
