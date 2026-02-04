"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui";
import { ClientDataFormValues } from "@/lib/validationSchemas";
import {
  User,
  Briefcase,
  Building2,
  Factory,
  Mail,
  Phone,
  Globe,
  Linkedin,
} from "lucide-react";

interface Step1ClientDataProps {
  register: UseFormRegister<ClientDataFormValues>;
  errors: FieldErrors<ClientDataFormValues>;
}

export function Step1ClientData({ register, errors }: Step1ClientDataProps) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-dark-800 mb-2">
          Dados do Cliente e Empresa
        </h2>
        <p className="text-dark-500">
          Vamos começar conhecendo você e sua empresa. Essas informações nos
          ajudarão a personalizar sua proposta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nome completo"
          placeholder="Seu nome completo"
          leftIcon={<User className="h-5 w-5" />}
          error={errors.name?.message}
          required
          {...register("name")}
        />

        <Input
          label="Cargo/Função"
          placeholder="Ex: CEO, Diretor de Marketing"
          leftIcon={<Briefcase className="h-5 w-5" />}
          error={errors.role?.message}
          required
          {...register("role")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nome da empresa"
          placeholder="Nome da sua empresa"
          leftIcon={<Building2 className="h-5 w-5" />}
          error={errors.company?.message}
          required
          {...register("company")}
        />

        <Input
          label="Segmento/Área de atuação"
          placeholder="Ex: Tecnologia, Varejo, Saúde"
          leftIcon={<Factory className="h-5 w-5" />}
          error={errors.industry?.message}
          required
          {...register("industry")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="E-mail corporativo"
          type="email"
          placeholder="seu@email.com.br"
          leftIcon={<Mail className="h-5 w-5" />}
          error={errors.email?.message}
          required
          {...register("email")}
        />

        <Input
          label="Telefone/WhatsApp"
          type="tel"
          placeholder="(00) 00000-0000"
          leftIcon={<Phone className="h-5 w-5" />}
          error={errors.phone?.message}
          required
          {...register("phone")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Website"
          placeholder="https://suaempresa.com.br"
          leftIcon={<Globe className="h-5 w-5" />}
          error={errors.website?.message}
          hint="Opcional"
          {...register("website")}
        />

        <Input
          label="LinkedIn"
          placeholder="https://linkedin.com/in/seuperfil"
          leftIcon={<Linkedin className="h-5 w-5" />}
          error={errors.linkedin?.message}
          hint="Opcional"
          {...register("linkedin")}
        />
      </div>
    </div>
  );
}
