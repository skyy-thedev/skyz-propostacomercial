"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ProposalSectionProps {
  number: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function ProposalSection({
  number,
  title,
  icon,
  children,
  className = "",
}: ProposalSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`print:break-inside-avoid ${className}`}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-white font-bold text-lg shadow-lg">
          {number}
        </div>
        <div className="flex items-center gap-3">
          {icon && <div className="text-primary">{icon}</div>}
          <h2 className="text-2xl font-bold text-dark-800">{title}</h2>
        </div>
      </div>
      <div className="pl-16">{children}</div>
    </motion.section>
  );
}
