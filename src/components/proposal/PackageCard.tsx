"use client";

import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { GeneratedPackage } from "@/types/database.types";
import { formatCurrency } from "@/lib/utils";

interface PackageCardProps {
  package: GeneratedPackage;
  isRecommended?: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
}

export default function PackageCard({
  package: pkg,
  isRecommended = false,
  onSelect,
  isSelected = false,
}: PackageCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`relative rounded-2xl border-2 p-6 transition-all print:break-inside-avoid ${
        isRecommended
          ? "border-primary bg-gradient-to-br from-primary-50 to-secondary-50 shadow-xl shadow-primary/20"
          : isSelected
          ? "border-primary bg-primary-50"
          : "border-dark-200 bg-white hover:border-primary/50 hover:shadow-lg"
      }`}
    >
      {/* Badge Recomendado */}
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
          <Star className="w-4 h-4" />
          Recomendado
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6 pt-2">
        <h3 className="text-xl font-bold text-dark-800 mb-2">{pkg.name}</h3>
        <p className="text-sm text-dark-500 mb-4">{pkg.description}</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-primary">
            {formatCurrency(pkg.price)}
          </span>
        </div>
        <p className="text-sm text-dark-400 mt-2">Prazo: {pkg.timeline}</p>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-6">
        {pkg.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <div
              className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                isRecommended
                  ? "bg-primary text-white"
                  : "bg-success/20 text-success"
              }`}
            >
              <Check className="w-3 h-3" />
            </div>
            <span className="text-sm text-dark-700">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Botão Selecionar (se tiver callback) */}
      {onSelect && (
        <button
          onClick={onSelect}
          className={`w-full py-3 rounded-xl font-semibold transition-all ${
            isSelected
              ? "bg-primary text-white"
              : isRecommended
              ? "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg"
              : "bg-dark-100 text-dark-700 hover:bg-dark-200"
          }`}
        >
          {isSelected ? "Selecionado" : "Escolher Este Plano"}
        </button>
      )}
    </motion.div>
  );
}
