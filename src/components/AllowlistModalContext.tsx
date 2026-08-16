"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type AllowlistModalContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const AllowlistModalContext = createContext<AllowlistModalContextValue | null>(null);

export function AllowlistModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("allowlist") !== "1") return;

      setIsOpen(true);
      params.delete("allowlist");
      params.delete("xconnected");
      params.delete("xerror");
      const query = params.toString();
      window.history.replaceState({}, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
    });
  }, []);

  return (
    <AllowlistModalContext.Provider
      value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}
    >
      {children}
    </AllowlistModalContext.Provider>
  );
}

export function useAllowlistModal() {
  const ctx = useContext(AllowlistModalContext);
  if (!ctx) {
    throw new Error("useAllowlistModal must be used within an AllowlistModalProvider");
  }
  return ctx;
}
