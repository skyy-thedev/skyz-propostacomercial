"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FormStepWrapperProps {
  children: React.ReactNode;
  stepKey: string;
  direction?: "forward" | "backward";
}

const variants = {
  enter: (direction: "forward" | "backward") => ({
    x: direction === "forward" ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: "forward" | "backward") => ({
    x: direction === "forward" ? -100 : 100,
    opacity: 0,
  }),
};

export function FormStepWrapper({
  children,
  stepKey,
  direction = "forward",
}: FormStepWrapperProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={stepKey}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
