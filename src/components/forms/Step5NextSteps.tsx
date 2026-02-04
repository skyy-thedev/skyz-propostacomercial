"use client";

import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { Select, RadioGroup, Textarea, Input } from "@/components/ui";
import { NextStepsFormValues } from "@/lib/validationSchemas";
import {
  RESPONSE_TIME_OPTIONS,
  MEETING_OPTIONS,
  HOW_FOUND_OPTIONS,
} from "@/types/proposal.types";

interface Step5NextStepsProps {
  register: UseFormRegister<NextStepsFormValues>;
  errors: FieldErrors<NextStepsFormValues>;
  watch: UseFormWatch<NextStepsFormValues>;
  setValue: UseFormSetValue<NextStepsFormValues>;
}

export function Step5NextSteps({
  register,
  errors,
  watch,
  setValue,
}: Step5NextStepsProps) {
  const wantsMeeting = watch("wantsMeeting");

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-dark-800 mb-2">
          Próximos Passos
        </h2>
        <p className="text-dark-500">
          Estamos quase lá! Essas últimas informações nos ajudarão a definir os
          próximos passos após o envio da proposta.
        </p>
      </div>

      <RadioGroup
        label="Se enviarmos uma proposta detalhada, qual seria o melhor prazo para retornarmos o contato?"
        options={RESPONSE_TIME_OPTIONS}
        value={watch("responseTime")}
        onValueChange={(value) => setValue("responseTime", value)}
        error={errors.responseTime?.message}
        required
      />

      <Textarea
        label="Existe alguma barreira ou preocupação interna que devemos saber?"
        placeholder="Compartilhe conosco qualquer preocupação ou barreira que possa influenciar a decisão..."
        {...register("concerns")}
        error={errors.concerns?.message}
        hint="Opcional - Isso nos ajuda a abordar possíveis objeções na proposta"
        value={watch("concerns")}
      />

      <div className="space-y-3">
        <RadioGroup
          label="Gostaria de agendar uma reunião de alinhamento após receber a proposta?"
          options={MEETING_OPTIONS}
          value={watch("wantsMeeting")}
          onValueChange={(value) => setValue("wantsMeeting", value)}
          error={errors.wantsMeeting?.message}
          required
        />

        {wantsMeeting === "yes" && (
          <Input
            label="Melhor dia/horário para a reunião"
            placeholder="Ex: Segunda ou terça-feira pela manhã"
            {...register("meetingTime")}
            className="mt-3"
          />
        )}
      </div>

      <Select
        label="Como conheceu a Skyz Design BR?"
        placeholder="Selecione uma opção"
        options={HOW_FOUND_OPTIONS}
        value={watch("howFound")}
        onValueChange={(value) => setValue("howFound", value)}
        error={errors.howFound?.message}
        required
      />

      <Textarea
        label="Observações adicionais ou requisitos específicos"
        placeholder="Use este espaço para compartilhar qualquer informação adicional que considere importante..."
        {...register("additionalNotes")}
        error={errors.additionalNotes?.message}
        charCount
        maxLength={2000}
        hint="Opcional"
        value={watch("additionalNotes")}
      />
    </div>
  );
}
