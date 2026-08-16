"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

export default function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration: 0.9,
      ease: "easeOut",
      onUpdate(v) {
        setDisplay(Math.round(v));
      },
    });
    prev.current = value;
    return controls.stop;
  }, [value]);

  return <>{display.toLocaleString()}</>;
}
