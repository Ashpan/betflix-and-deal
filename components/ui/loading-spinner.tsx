"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

export function LoadingSpinner({
  size = 24,
  color = "text-primary",
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`rounded-full border-2 border-t-2 ${color} border-t-transparent`}
        style={{
          width: size,
          height: size,
          borderTopWidth: size / 8,
          borderWidth: size / 8,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
