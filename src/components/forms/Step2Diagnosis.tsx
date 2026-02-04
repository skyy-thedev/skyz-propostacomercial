"use client";

import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { Textarea, Select } from "@/components/ui";
import { DiagnosisFormValues } from "@/lib/validationSchemas";
import { PROBLEM_DURATION_OPTIONS } from "@/types/proposal.types";

interface Step2DiagnosisProps {
  register: UseFormRegister<DiagnosisFormValues>;
  errors: FieldErrors<DiagnosisFormValues>;
  watch: UseFormWatch<DiagnosisFormValues>;
  setValue: UseFormSetValue<DiagnosisFormValues>;
}

export function Step2Diagnosis({
  register,
  errors,
  watch,
  setValue,
}: Step2DiagnosisProps) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-dark-800 mb-2">
          Diagnóstico e Desafios
        </h2>
        <p className="text-dark-500">
          Entender seus desafios é fundamental para propormos a melhor solução.
          Responda com o máximo de detalhes possível.
        </p>
      </div>

      <Textarea
        label="Qual é o maior obstáculo que impede sua empresa de alcançar seus objetivos de tecnologia/design?"
        placeholder="Descreva detalhadamente o principal desafio que sua empresa enfrenta atualmente..."
        error={errors.mainObstacle?.message}
        required
        charCount
        maxLength={1000}
        {...register("mainObstacle")}
        value={watch("mainObstacle")}
      />

      <Select
        label="Há quanto tempo sua organização enfrenta esse desafio?"
        placeholder="Selecione o período"
        options={PROBLEM_DURATION_OPTIONS}
        value={watch("problemDuration")}
        onValueChange={(value) => setValue("problemDuration", value)}
        error={errors.problemDuration?.message}
        required
      />

      <Textarea
        label="O que motivou você a buscar uma solução agora?"
        placeholder="Explique por que este é o momento certo para resolver esse problema..."
        error={errors.motivation?.message}
        required
        charCount
        maxLength={1000}
        {...register("motivation")}
        value={watch("motivation")}
      />

      <Textarea
        label="Quais estratégias ou ferramentas foram tentadas anteriormente?"
        placeholder="Descreva as soluções que já foram tentadas para resolver esse problema..."
        error={errors.previousAttempts?.message}
        required
        charCount
        maxLength={1000}
        {...register("previousAttempts")}
        value={watch("previousAttempts")}
      />

      <Textarea
        label="Por que as soluções anteriores não funcionaram adequadamente?"
        placeholder="Explique os motivos pelos quais as tentativas anteriores não tiveram sucesso..."
        error={errors.whyFailed?.message}
        required
        charCount
        maxLength={1000}
        {...register("whyFailed")}
        value={watch("whyFailed")}
      />

      <Textarea
        label="Quais são as possíveis consequências se esse problema não for resolvido nos próximos 6 meses?"
        placeholder="Descreva o impacto negativo que a empresa pode sofrer se não resolver esse desafio..."
        error={errors.consequences?.message}
        required
        charCount
        maxLength={1000}
        {...register("consequences")}
        value={watch("consequences")}
      />
    </div>
  );
}
