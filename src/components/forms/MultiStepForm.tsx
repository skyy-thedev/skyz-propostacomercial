"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, FileText, Loader2 } from "lucide-react";

import { Button } from "@/components/ui";
import {
  FormProgress,
  FormStepWrapper,
  Step1ClientData,
  Step2Diagnosis,
  Step3Solution,
  Step4Commercial,
  Step5NextSteps,
} from "@/components/forms";

import {
  clientDataSchema,
  diagnosisSchema,
  solutionSchema,
  commercialSchema,
  nextStepsSchema,
  ClientDataFormValues,
  DiagnosisFormValues,
  SolutionFormValues,
  CommercialFormValues,
  NextStepsFormValues,
  defaultClientData,
  defaultDiagnosis,
  defaultSolution,
  defaultCommercial,
  defaultNextSteps,
} from "@/lib/validationSchemas";

import {
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
  debounce,
  generateProposalNumber,
} from "@/lib/utils";

import { ProposalData } from "@/types/proposal.types";

const STORAGE_KEY = "proposal-form-data";
const TOTAL_STEPS = 5;

interface MultiStepFormProps {
  onComplete: (data: ProposalData) => Promise<void>;
}

type FormDirection = "forward" | "backward";

export function MultiStepForm({ onComplete }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<FormDirection>("forward");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form para cada etapa
  const step1Form = useForm<ClientDataFormValues>({
    resolver: zodResolver(clientDataSchema),
    defaultValues: defaultClientData,
    mode: "onBlur",
  });

  const step2Form = useForm<DiagnosisFormValues>({
    resolver: zodResolver(diagnosisSchema),
    defaultValues: defaultDiagnosis,
    mode: "onBlur",
  });

  const step3Form = useForm<SolutionFormValues>({
    resolver: zodResolver(solutionSchema),
    defaultValues: defaultSolution,
    mode: "onBlur",
  });

  const step4Form = useForm<CommercialFormValues>({
    resolver: zodResolver(commercialSchema),
    defaultValues: defaultCommercial,
    mode: "onBlur",
  });

  const step5Form = useForm<NextStepsFormValues>({
    resolver: zodResolver(nextStepsSchema),
    defaultValues: defaultNextSteps,
    mode: "onBlur",
  });

  // Carregar dados salvos do localStorage
  useEffect(() => {
    const savedData = loadFromLocalStorage<{
      step1: ClientDataFormValues;
      step2: DiagnosisFormValues;
      step3: SolutionFormValues;
      step4: CommercialFormValues;
      step5: NextStepsFormValues;
      currentStep: number;
    }>(STORAGE_KEY);

    if (savedData) {
      if (savedData.step1) step1Form.reset(savedData.step1);
      if (savedData.step2) step2Form.reset(savedData.step2);
      if (savedData.step3) step3Form.reset(savedData.step3);
      if (savedData.step4) step4Form.reset(savedData.step4);
      if (savedData.step5) step5Form.reset(savedData.step5);
      if (savedData.currentStep) setCurrentStep(savedData.currentStep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save debounced
  const saveData = useCallback(() => {
    const debouncedSave = debounce(() => {
      const data = {
        step1: step1Form.getValues(),
        step2: step2Form.getValues(),
        step3: step3Form.getValues(),
        step4: step4Form.getValues(),
        step5: step5Form.getValues(),
        currentStep,
      };
      saveToLocalStorage(STORAGE_KEY, data);
    }, 1000);
    debouncedSave();
  }, [currentStep, step1Form, step2Form, step3Form, step4Form, step5Form]);

  // Salvar dados quando qualquer form mudar
  useEffect(() => {
    const subscriptions = [
      step1Form.watch(() => saveData()),
      step2Form.watch(() => saveData()),
      step3Form.watch(() => saveData()),
      step4Form.watch(() => saveData()),
      step5Form.watch(() => saveData()),
    ];

    return () => {
      subscriptions.forEach((sub) => sub.unsubscribe());
    };
  }, [saveData, step1Form, step2Form, step3Form, step4Form, step5Form]);

  // Validar e avançar
  const handleNext = async () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = await step1Form.trigger();
        break;
      case 2:
        isValid = await step2Form.trigger();
        break;
      case 3:
        isValid = await step3Form.trigger();
        break;
      case 4:
        isValid = await step4Form.trigger();
        break;
      case 5:
        isValid = await step5Form.trigger();
        break;
    }

    if (isValid) {
      if (currentStep < TOTAL_STEPS) {
        setDirection("forward");
        setCurrentStep((prev) => prev + 1);
        saveData();
      } else {
        // Submeter formulário completo
        handleSubmit();
      }
    }
  };

  // Voltar
  const handleBack = () => {
    if (currentStep > 1) {
      setDirection("backward");
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Submeter formulário completo
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const proposalData: ProposalData = {
        client: step1Form.getValues(),
        diagnosis: step2Form.getValues(),
        solution: step3Form.getValues(),
        commercial: step4Form.getValues(),
        nextSteps: step5Form.getValues(),
        proposalNumber: generateProposalNumber(),
        createdAt: new Date().toISOString(),
      };

      await onComplete(proposalData);
      clearLocalStorage(STORAGE_KEY);
    } catch (error) {
      console.error("Erro ao gerar proposta:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar step atual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1ClientData
            register={step1Form.register}
            errors={step1Form.formState.errors}
          />
        );
      case 2:
        return (
          <Step2Diagnosis
            register={step2Form.register}
            errors={step2Form.formState.errors}
            watch={step2Form.watch}
            setValue={step2Form.setValue}
          />
        );
      case 3:
        return (
          <Step3Solution
            register={step3Form.register}
            errors={step3Form.formState.errors}
            watch={step3Form.watch}
            setValue={step3Form.setValue}
          />
        );
      case 4:
        return (
          <Step4Commercial
            register={step4Form.register}
            errors={step4Form.formState.errors}
            watch={step4Form.watch}
            setValue={step4Form.setValue}
          />
        );
      case 5:
        return (
          <Step5NextSteps
            register={step5Form.register}
            errors={step5Form.formState.errors}
            watch={step5Form.watch}
            setValue={step5Form.setValue}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <FormProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      <motion.div
        className="form-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FormStepWrapper stepKey={`step-${currentStep}`} direction={direction}>
          {renderCurrentStep()}
        </FormStepWrapper>

        {/* Navegação */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-dark-100">
          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Voltar
          </Button>

          {currentStep < TOTAL_STEPS ? (
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Próximo
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              isLoading={isSubmitting}
              variant="success"
              rightIcon={!isSubmitting && <FileText className="h-4 w-4" />}
            >
              {isSubmitting ? "Gerando Proposta..." : "Gerar Proposta"}
            </Button>
          )}
        </div>
      </motion.div>

      {/* Indicador de auto-save */}
      <motion.p
        className="text-center text-sm text-dark-400 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        💾 Suas respostas são salvas automaticamente
      </motion.p>
    </div>
  );
}
