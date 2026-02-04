"use client";

import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { Select, RadioGroup, Checkbox, Input, Textarea } from "@/components/ui";
import { CommercialFormValues } from "@/lib/validationSchemas";
import {
  BUDGET_OPTIONS,
  DECISION_MAKER_OPTIONS,
  DECISION_FACTORS_OPTIONS,
  PACKAGES_NUMBER_OPTIONS,
} from "@/types/proposal.types";

interface Step4CommercialProps {
  register: UseFormRegister<CommercialFormValues>;
  errors: FieldErrors<CommercialFormValues>;
  watch: UseFormWatch<CommercialFormValues>;
  setValue: UseFormSetValue<CommercialFormValues>;
}

export function Step4Commercial({
  register,
  errors,
  watch,
  setValue,
}: Step4CommercialProps) {
  const selectedFactors = watch("decisionFactors") || [];
  const approvalProcess = watch("approvalProcess");

  const handleFactorChange = (value: string, checked: boolean) => {
    const current = selectedFactors;
    if (checked) {
      setValue("decisionFactors", [...current, value]);
    } else {
      setValue(
        "decisionFactors",
        current.filter((v) => v !== value)
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-dark-800 mb-2">
          Informações Comerciais
        </h2>
        <p className="text-dark-500">
          Essas informações nos ajudam a criar uma proposta alinhada às suas
          expectativas e possibilidades.
        </p>
      </div>

      <Select
        label="Qual é o orçamento estimado para esta solução?"
        placeholder="Selecione o orçamento"
        options={BUDGET_OPTIONS}
        value={watch("budget")}
        onValueChange={(value) => setValue("budget", value)}
        error={errors.budget?.message}
        required
      />

      <RadioGroup
        label="Quem é o responsável pela tomada de decisão final?"
        options={DECISION_MAKER_OPTIONS}
        value={watch("decisionMaker")}
        onValueChange={(value) => setValue("decisionMaker", value)}
        error={errors.decisionMaker?.message}
        required
      />

      <div className="space-y-3">
        <RadioGroup
          label="O processo de decisão envolve aprovações específicas?"
          options={[
            { value: "yes", label: "Sim" },
            { value: "no", label: "Não" },
          ]}
          value={watch("approvalProcess")}
          onValueChange={(value) => setValue("approvalProcess", value)}
          error={errors.approvalProcess?.message}
          required
          orientation="horizontal"
        />

        {approvalProcess === "yes" && (
          <Textarea
            placeholder="Descreva brevemente o processo de aprovação..."
            {...register("approvalDetails")}
            className="mt-3"
          />
        )}
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-dark-700">
          Além do investimento, quais fatores são cruciais para sua decisão?
          <span className="text-error ml-1">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white/30 rounded-xl p-4 border border-dark-100">
          {DECISION_FACTORS_OPTIONS.map((option) => (
            <Checkbox
              key={option.value}
              label={option.label}
              checked={selectedFactors.includes(option.value)}
              onCheckedChange={(checked) =>
                handleFactorChange(option.value, checked)
              }
            />
          ))}
        </div>
        <Input
          placeholder="Outros fatores (opcional)"
          {...register("otherDecisionFactor")}
          hint="Se tiver outros fatores não listados acima"
        />
        {errors.decisionFactors?.message && (
          <p className="text-sm text-error">{errors.decisionFactors.message}</p>
        )}
      </div>

      <RadioGroup
        label="Prefere receber quantas opções de pacotes/propostas?"
        options={PACKAGES_NUMBER_OPTIONS}
        value={watch("packagesNumber")}
        onValueChange={(value) => setValue("packagesNumber", value)}
        error={errors.packagesNumber?.message}
        required
      />
    </div>
  );
}
