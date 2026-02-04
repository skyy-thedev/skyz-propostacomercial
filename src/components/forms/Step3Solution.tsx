"use client";

import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { Textarea, Select, Checkbox, Input } from "@/components/ui";
import { SolutionFormValues } from "@/lib/validationSchemas";
import {
  OBJECTIVES_OPTIONS,
  BENEFICIARIES_OPTIONS,
  TIMELINE_OPTIONS,
} from "@/types/proposal.types";

interface Step3SolutionProps {
  register: UseFormRegister<SolutionFormValues>;
  errors: FieldErrors<SolutionFormValues>;
  watch: UseFormWatch<SolutionFormValues>;
  setValue: UseFormSetValue<SolutionFormValues>;
}

export function Step3Solution({
  register,
  errors,
  watch,
  setValue,
}: Step3SolutionProps) {
  const selectedObjectives = watch("objectives") || [];

  const handleObjectiveChange = (value: string, checked: boolean) => {
    const current = selectedObjectives;
    if (checked) {
      setValue("objectives", [...current, value]);
    } else {
      setValue(
        "objectives",
        current.filter((v) => v !== value)
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-dark-800 mb-2">
          Solução Desejada e Objetivos
        </h2>
        <p className="text-dark-500">
          Vamos entender como você imagina a solução ideal e quais resultados
          espera alcançar.
        </p>
      </div>

      <Textarea
        label="Como seria a solução ideal para sua empresa?"
        placeholder="Descreva em detalhes como você imagina a solução perfeita para resolver seu desafio..."
        error={errors.idealSolution?.message}
        required
        charCount
        maxLength={1000}
        {...register("idealSolution")}
        value={watch("idealSolution")}
      />

      <div className="space-y-3">
        <label className="block text-sm font-medium text-dark-700">
          Quais objetivos específicos você pretende alcançar?
          <span className="text-error ml-1">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white/30 rounded-xl p-4 border border-dark-100">
          {OBJECTIVES_OPTIONS.map((option) => (
            <Checkbox
              key={option.value}
              label={option.label}
              checked={selectedObjectives.includes(option.value)}
              onCheckedChange={(checked) =>
                handleObjectiveChange(option.value, checked)
              }
            />
          ))}
        </div>
        <Input
          placeholder="Outros objetivos (opcional)"
          {...register("otherObjective")}
          hint="Se tiver outros objetivos não listados acima"
        />
        {errors.objectives?.message && (
          <p className="text-sm text-error">{errors.objectives.message}</p>
        )}
      </div>

      <Select
        label="Quem na empresa mais se beneficiará com essa solução?"
        placeholder="Selecione os beneficiários"
        options={BENEFICIARIES_OPTIONS}
        value={watch("beneficiaries")}
        onValueChange={(value) => setValue("beneficiaries", value)}
        error={errors.beneficiaries?.message}
        required
      />

      <Select
        label="Qual é o prazo ideal para implementação?"
        placeholder="Selecione o prazo"
        options={TIMELINE_OPTIONS}
        value={watch("timeline")}
        onValueChange={(value) => setValue("timeline", value)}
        error={errors.timeline?.message}
        required
      />

      <Input
        label="Existe alguma data limite importante? (lançamento, evento, etc.)"
        placeholder="Ex: Precisamos lançar antes do evento X em março"
        {...register("deadline")}
        error={errors.deadline?.message}
        hint="Opcional"
      />
    </div>
  );
}
