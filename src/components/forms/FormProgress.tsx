"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, User, Search, Lightbulb, DollarSign, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui";

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  { id: 1, title: "Dados do Cliente", icon: User },
  { id: 2, title: "Diagnóstico", icon: Search },
  { id: 3, title: "Solução Desejada", icon: Lightbulb },
  { id: 4, title: "Informações Comerciais", icon: DollarSign },
  { id: 5, title: "Próximos Passos", icon: ArrowRight },
];

export function FormProgress({ currentStep, totalSteps }: FormProgressProps) {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full mb-8">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-dark-600">
            Etapa {currentStep} de {totalSteps}
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.round(progressPercentage)}% concluído
          </span>
        </div>
        <Progress value={progressPercentage} />
      </div>

      {/* Steps indicators */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-dark-100 -z-10" />
        <motion.div
          className="absolute left-0 top-5 h-0.5 bg-gradient-primary -z-10"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          const isPending = step.id > currentStep;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center"
            >
              <motion.div
                className={cn(
                  "step-indicator",
                  isCompleted && "completed",
                  isActive && "active",
                  isPending && "pending"
                )}
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </motion.div>
              <span
                className={cn(
                  "text-xs mt-2 font-medium text-center max-w-[80px]",
                  isActive && "text-primary",
                  isCompleted && "text-success",
                  isPending && "text-dark-400"
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile step indicator */}
      <div className="flex md:hidden items-center justify-center gap-2">
        <span className="text-sm font-medium text-dark-600">
          {steps[currentStep - 1]?.title}
        </span>
      </div>
    </div>
  );
}
