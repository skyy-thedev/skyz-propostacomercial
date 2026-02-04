"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Step1Service from "./steps/Step1Service";
import Step2Business from "./steps/Step2Business";
import Step3Investment from "./steps/Step3Investment";
import FormProgressBar from "./FormProgressBar";

export interface FormData {
  // Step 1 - Serviço
  category?: "design" | "web";
  service?: string;
  serviceOption?: string;
  timeline?: string;

  // Step 2 - Negócio
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCompany?: string;
  clientSegment?: string;
  challenges?: string[];
  hasBranding?: string;

  // Step 3 - Investimento
  budget?: string;
  deliveryMethod?: string[];
  wantsMeeting?: string;
  observations?: string;

  // V3: Opções de envio automático
  sendProposalByEmail?: boolean;
  sendProposalByWhatsApp?: boolean;
}

const STEP_TITLES = [
  "Escolha seu serviço",
  "Sobre seu negócio",
  "Investimento",
];

export default function OptimizedForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 3;

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = (stepData: Partial<FormData>) => {
    updateFormData(stepData);

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (finalStepData: Partial<FormData>) => {
    const completeData = { ...formData, ...finalStepData };
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/proposals/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completeData),
      });

      const result = await response.json();

      if (result.success) {
        router.push(`/proposta/${result.proposalId}`);
      } else {
        throw new Error(result.error || "Erro ao criar proposta");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao gerar proposta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-xl">
            <span className="text-white font-bold text-3xl">S</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-dark-800 mb-2">
            Crie Sua Proposta Personalizada
          </h1>
          <p className="text-dark-500">
            Em apenas 2-3 minutos você terá uma proposta completa e profissional
          </p>
        </motion.div>

        {/* Progress Bar */}
        <FormProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepTitles={STEP_TITLES}
        />

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-8"
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Step1Service onNext={handleNext} initialData={formData} />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Step2Business
                  onNext={handleNext}
                  onBack={handleBack}
                  initialData={formData}
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Step3Investment
                  onSubmit={handleSubmit}
                  onBack={handleBack}
                  initialData={formData}
                  isSubmitting={isSubmitting}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Trust Indicators */}
        <div className="text-center text-sm text-dark-400 flex items-center justify-center gap-4 flex-wrap">
          <span className="flex items-center gap-1">
            🔒 Dados seguros
          </span>
          <span className="flex items-center gap-1">
            ⚡ Resposta em segundos
          </span>
          <span className="flex items-center gap-1">
            ✨ 100% personalizado
          </span>
        </div>
      </div>
    </div>
  );
}
