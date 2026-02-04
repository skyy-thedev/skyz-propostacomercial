"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Target,
  Lightbulb,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  Wallet,
  MessageSquare,
  Sparkles,
  Award,
  Shield,
  Zap,
} from "lucide-react";
import { ProposalFromDB } from "@/types/database.types";
import ProposalSection from "./ProposalSection";
import PackageCard from "./PackageCard";
import { formatCurrency } from "@/lib/utils";
import {
  COMPANY_INFO,
  COMPANY_ABOUT,
  COMPANY_DIFFERENTIALS,
  TECHNOLOGIES,
} from "@/lib/config/company-content";
import {
  PROBLEM_DURATION_OPTIONS,
  BENEFICIARIES_OPTIONS,
  TIMELINE_OPTIONS,
  BUDGET_OPTIONS,
} from "@/types/proposal.types";

interface ProposalViewerProps {
  proposal: ProposalFromDB;
  isExpired: boolean;
}

// Helper para buscar label de opção
function getOptionLabel(
  options: { value: string; label: string }[],
  value: string
): string {
  return options.find((opt) => opt.value === value)?.label || value;
}

export default function ProposalViewer({
  proposal,
  isExpired,
}: ProposalViewerProps) {
  const packages = proposal.packages;

  // Registrar visualização
  useEffect(() => {
    fetch(`/api/proposals/${proposal.id}/track`, { method: "POST" }).catch(
      console.error
    );
  }, [proposal.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white shadow-2xl rounded-2xl overflow-hidden print:shadow-none">
      {/* ============================================ */}
      {/* CAPA */}
      {/* ============================================ */}
      <div className="relative bg-gradient-to-br from-primary via-secondary to-accent text-white p-12 md:p-20 text-center print:bg-primary print:p-12">
        {/* Pattern decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/pattern.svg')] bg-repeat" />
        </div>

        {isExpired && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 right-4 bg-error text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
          >
            Proposta Expirada
          </motion.div>
        )}

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="w-28 h-28 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-primary font-bold text-3xl">SKYZ</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold mb-4 tracking-tight"
        >
          PROPOSTA COMERCIAL
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-light mb-2"
        >
          {proposal.clientCompany}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg opacity-90 mb-8"
        >
          Proposta Nº {proposal.proposalNumber}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 text-sm"
        >
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <Calendar className="w-4 h-4" />
            <span>Emitida: {formatDate(proposal.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <Clock className="w-4 h-4" />
            <span>Válida até: {formatDate(proposal.validUntil)}</span>
          </div>
        </motion.div>
      </div>

      {/* ============================================ */}
      {/* CONTEÚDO */}
      {/* ============================================ */}
      <div className="p-8 md:p-12 space-y-16">
        {/* ============================================ */}
        {/* 1. SOBRE A EMPRESA */}
        {/* ============================================ */}
        <ProposalSection
          number="01"
          title="Sobre a Skyz Design BR"
          icon={<Building2 className="w-6 h-6" />}
        >
          <div className="space-y-6">
            <p className="text-dark-600 leading-relaxed text-lg">
              {COMPANY_ABOUT.full}
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-primary-50 p-6 rounded-xl">
                <h4 className="font-semibold text-primary-800 mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Missão
                </h4>
                <p className="text-sm text-dark-600">{COMPANY_ABOUT.mission}</p>
              </div>
              <div className="bg-secondary-50 p-6 rounded-xl">
                <h4 className="font-semibold text-secondary-800 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Visão
                </h4>
                <p className="text-sm text-dark-600">{COMPANY_ABOUT.vision}</p>
              </div>
            </div>

            {/* Diferenciais */}
            <div className="mt-8">
              <h4 className="font-semibold text-dark-800 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Nossos Diferenciais
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                {COMPANY_DIFFERENTIALS.slice(0, 3).map((diff, idx) => (
                  <div
                    key={idx}
                    className="bg-dark-50 p-4 rounded-xl border border-dark-100"
                  >
                    <div className="text-3xl mb-2">{diff.icon}</div>
                    <h5 className="font-semibold text-dark-800 mb-1">
                      {diff.title}
                    </h5>
                    <p className="text-sm text-dark-500">{diff.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ProposalSection>

        {/* ============================================ */}
        {/* 2. ENTENDIMENTO DO DESAFIO */}
        {/* ============================================ */}
        <ProposalSection
          number="02"
          title="Entendimento do Desafio"
          icon={<Lightbulb className="w-6 h-6" />}
        >
          <div className="space-y-6">
            <div className="bg-dark-50 p-6 rounded-xl border-l-4 border-primary">
              <h4 className="font-semibold text-dark-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Contexto Atual
              </h4>
              <p className="text-dark-600 leading-relaxed">
                Com base em nossa conversa, identificamos que{" "}
                <strong className="text-primary">{proposal.clientCompany}</strong>{" "}
                enfrenta o seguinte desafio:
              </p>
              <blockquote className="mt-4 pl-4 border-l-2 border-primary/30 text-dark-700 italic">
                &ldquo;{proposal.mainObstacle}&rdquo;
              </blockquote>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-dark-800 mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-secondary" />
                  Histórico do Problema
                </h4>
                <p className="text-dark-600">
                  Este problema persiste há{" "}
                  <strong>
                    {getOptionLabel(
                      PROBLEM_DURATION_OPTIONS,
                      proposal.problemDuration
                    )}
                  </strong>
                  .
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-dark-800 mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-warning" />
                  Motivação
                </h4>
                <p className="text-dark-600">{proposal.motivation}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-dark-800 mb-2">
                Tentativas Anteriores
              </h4>
              <p className="text-dark-600 mb-2">{proposal.previousAttempts}</p>
              <p className="text-dark-500 text-sm italic">
                Motivo do insucesso: {proposal.whyFailed}
              </p>
            </div>

            <div className="bg-warning/10 border border-warning/30 p-6 rounded-xl">
              <h4 className="font-semibold text-warning-700 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Impacto se Não Resolvido
              </h4>
              <p className="text-dark-700">{proposal.consequences}</p>
            </div>
          </div>
        </ProposalSection>

        {/* ============================================ */}
        {/* 3. SOLUÇÃO PROPOSTA */}
        {/* ============================================ */}
        <ProposalSection
          number="03"
          title="Solução Proposta"
          icon={<CheckCircle2 className="w-6 h-6" />}
        >
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-dark-800 mb-3">
                Visão da Solução
              </h4>
              <p className="text-dark-600 leading-relaxed text-lg">
                {proposal.idealSolution}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-dark-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-success" />
                Objetivos a Alcançar
              </h4>
              <ul className="space-y-3">
                {proposal.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-success/20 text-success flex items-center justify-center text-sm font-bold">
                      ✓
                    </span>
                    <span className="text-dark-700">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-xl">
              <h4 className="font-semibold text-primary-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Benefícios Esperados
              </h4>
              <ul className="space-y-2 text-dark-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Resolução completa dos desafios identificados
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Impacto direto em:{" "}
                  {getOptionLabel(BENEFICIARIES_OPTIONS, proposal.beneficiaries)}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Prazo de implementação:{" "}
                  {getOptionLabel(TIMELINE_OPTIONS, proposal.timeline)}
                </li>
                {proposal.deadline && (
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    Data limite respeitada: {proposal.deadline}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </ProposalSection>

        {/* ============================================ */}
        {/* 4. OPÇÕES DE INVESTIMENTO */}
        {/* ============================================ */}
        <ProposalSection
          number="04"
          title="Opções de Investimento"
          icon={<Wallet className="w-6 h-6" />}
        >
          <div className="space-y-6">
            <p className="text-dark-600 mb-6">
              Preparamos {packages.length} opções de pacotes personalizados para
              atender suas necessidades e orçamento:
            </p>

            <div
              className={`grid gap-6 ${
                packages.length === 3
                  ? "md:grid-cols-3"
                  : packages.length === 2
                  ? "md:grid-cols-2 max-w-3xl mx-auto"
                  : "max-w-md mx-auto"
              }`}
            >
              {packages.map((pkg, idx) => (
                <PackageCard
                  key={idx}
                  package={pkg}
                  isRecommended={idx === Math.floor(packages.length / 2)}
                />
              ))}
            </div>

            <div className="mt-8 bg-dark-50 p-6 rounded-xl print:bg-gray-100">
              <h4 className="font-semibold text-dark-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Formas de Pagamento
              </h4>
              <ul className="space-y-2 text-dark-600">
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <strong>À vista:</strong> 10% de desconto via PIX ou
                  transferência
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <strong>Parcelado:</strong> Até 12x no cartão de crédito
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <strong>Personalizado:</strong> Entrada + parcelas (sob
                  consulta)
                </li>
              </ul>
            </div>
          </div>
        </ProposalSection>

        {/* ============================================ */}
        {/* 5. CRONOGRAMA */}
        {/* ============================================ */}
        <ProposalSection
          number="05"
          title="Cronograma de Entrega"
          icon={<Calendar className="w-6 h-6" />}
        >
          <div className="space-y-6">
            <p className="text-dark-600 mb-6">
              Seguimos uma metodologia ágil para garantir entregas contínuas e
              alinhamento constante com suas expectativas:
            </p>

            <div className="space-y-4">
              {[
                {
                  week: "Semana 1-2",
                  title: "Kickoff e Planejamento",
                  desc: "Alinhamento de requisitos, definição de escopo e cronograma detalhado",
                },
                {
                  week: "Semana 3-6",
                  title: "Design e Prototipação",
                  desc: "Criação de wireframes, protótipos interativos e aprovação visual",
                },
                {
                  week: "Semana 7-12",
                  title: "Desenvolvimento",
                  desc: "Codificação, integrações e implementação de funcionalidades",
                },
                {
                  week: "Semana 13-14",
                  title: "Testes e Ajustes",
                  desc: "QA completo, correções e otimizações finais",
                },
                {
                  week: "Semana 15",
                  title: "Deploy e Entrega",
                  desc: "Publicação, documentação e treinamento da equipe",
                },
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="flex-1 bg-dark-50 p-4 rounded-xl">
                    <div className="text-sm text-primary font-medium mb-1">
                      {step.week}
                    </div>
                    <h4 className="font-semibold text-dark-800">
                      {step.title}
                    </h4>
                    <p className="text-dark-500 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ProposalSection>

        {/* ============================================ */}
        {/* 6. TECNOLOGIAS */}
        {/* ============================================ */}
        <ProposalSection
          number="06"
          title="Stack Tecnológico"
          icon={<Zap className="w-6 h-6" />}
        >
          <div className="space-y-4">
            <p className="text-dark-600 mb-6">
              Utilizamos as tecnologias mais modernas e consolidadas do mercado
              para garantir performance, segurança e escalabilidade:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TECHNOLOGIES.slice(0, 8).map((tech, idx) => (
                <div
                  key={idx}
                  className="bg-dark-50 p-4 rounded-xl text-center hover:shadow-md transition-shadow"
                >
                  <div className="text-xs text-primary font-medium uppercase tracking-wide mb-1">
                    {tech.category}
                  </div>
                  <p className="font-medium text-dark-700 text-sm">
                    {tech.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ProposalSection>

        {/* ============================================ */}
        {/* INFORMAÇÕES DO CLIENTE */}
        {/* ============================================ */}
        <div className="border-t-2 border-dark-100 pt-12 mt-12">
          <h3 className="text-xl font-bold text-dark-800 mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            Proposta Elaborada Para:
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div className="bg-dark-50 p-4 rounded-xl">
              <p className="text-dark-500 mb-1 flex items-center gap-2">
                <User className="w-4 h-4" /> Nome
              </p>
              <p className="font-semibold text-dark-800">
                {proposal.clientName}
              </p>
            </div>
            <div className="bg-dark-50 p-4 rounded-xl">
              <p className="text-dark-500 mb-1 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Cargo
              </p>
              <p className="font-semibold text-dark-800">
                {proposal.clientRole}
              </p>
            </div>
            <div className="bg-dark-50 p-4 rounded-xl">
              <p className="text-dark-500 mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4" /> E-mail
              </p>
              <p className="font-semibold text-dark-800">
                {proposal.clientEmail}
              </p>
            </div>
            <div className="bg-dark-50 p-4 rounded-xl">
              <p className="text-dark-500 mb-1 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Telefone
              </p>
              <p className="font-semibold text-dark-800">
                {proposal.clientPhone}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent text-white p-12 text-center print:bg-primary">
        <h3 className="text-3xl font-bold mb-4">
          Vamos Transformar Sua Visão em Realidade Digital!
        </h3>
        <p className="text-lg opacity-90 mb-8">
          Entre em contato para agendar uma conversa e tirar suas dúvidas
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <a
            href={`mailto:${COMPANY_INFO.email}`}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <Mail className="w-4 h-4" />
            {COMPANY_INFO.email}
          </a>
          <a
            href={`tel:${COMPANY_INFO.phone}`}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <Phone className="w-4 h-4" />
            {COMPANY_INFO.phone}
          </a>
          <a
            href={COMPANY_INFO.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
          >
            📸 @skyzdesignbr
          </a>
        </div>
      </div>
    </div>
  );
}
