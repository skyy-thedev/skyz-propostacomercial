"use client";

import { motion } from "framer-motion";

interface FormProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export default function FormProgressBar({
  currentStep,
  totalSteps,
  stepTitles,
}: FormProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      {/* Step Indicators */}
      <div className="flex justify-between items-center mb-3 relative">
        {stepTitles.map((title, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;

          return (
            <div
              key={index}
              className="flex flex-col items-center z-10"
              style={{ flex: 1 }}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted
                    ? "#10B981"
                    : isActive
                    ? "#1C41E6"
                    : "#E5E7EB",
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                  isCompleted || isActive ? "text-white" : "text-dark-400"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </motion.div>
              <span
                className={`text-xs mt-2 text-center hidden sm:block ${
                  isActive ? "text-primary font-medium" : "text-dark-400"
                }`}
              >
                {title}
              </span>
            </div>
          );
        })}

        {/* Connecting Line Background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0 mx-16" />
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
        />
      </div>

      {/* Progress Text */}
      <div className="flex justify-between items-center mt-2 text-sm">
        <span className="text-dark-400">
          Etapa {currentStep} de {totalSteps}
        </span>
        <span className="text-primary font-medium">
          {Math.round(progress)}% completo
        </span>
      </div>
    </div>
  );
}
