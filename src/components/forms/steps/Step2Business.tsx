"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FormData } from "../OptimizedForm";

interface Step2BusinessProps {
  onNext: (data: Partial<FormData>) => void;
  onBack: () => void;
  initialData: FormData;
}

const CHALLENGES = [
  { id: "visibility", label: "Aumentar visibilidade online", icon: "👁️" },
  { id: "sales", label: "Gerar mais vendas", icon: "💰" },
  { id: "branding", label: "Fortalecer a marca", icon: "✨" },
  { id: "engagement", label: "Aumentar engajamento", icon: "💬" },
  { id: "presence", label: "Criar presença digital", icon: "📱" },
  { id: "conversion", label: "Melhorar conversão", icon: "🎯" },
];

const SEGMENTS = [
  "E-commerce",
  "Serviços",
  "Saúde e Bem-estar",
  "Educação",
  "Gastronomia",
  "Moda e Beleza",
  "Tecnologia",
  "Imobiliário",
  "Jurídico",
  "Outro",
];

export default function Step2Business({
  onNext,
  onBack,
  initialData,
}: Step2BusinessProps) {
  const [clientName, setClientName] = useState(initialData.clientName || "");
  const [clientEmail, setClientEmail] = useState(initialData.clientEmail || "");
  const [clientPhone, setClientPhone] = useState(initialData.clientPhone || "");
  const [clientCompany, setClientCompany] = useState(
    initialData.clientCompany || ""
  );
  const [clientSegment, setClientSegment] = useState(
    initialData.clientSegment || ""
  );
  const [challenges, setChallenges] = useState<string[]>(
    initialData.challenges || []
  );
  const [hasBranding, setHasBranding] = useState(initialData.hasBranding || "");

  const toggleChallenge = (challengeId: string) => {
    setChallenges((prev) =>
      prev.includes(challengeId)
        ? prev.filter((c) => c !== challengeId)
        : [...prev, challengeId]
    );
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{2})/, "($1) ")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientPhone(formatPhone(e.target.value));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = () => {
    if (!clientName || !clientEmail || !validateEmail(clientEmail)) return;

    onNext({
      clientName,
      clientEmail,
      clientPhone,
      clientCompany,
      clientSegment,
      challenges,
      hasBranding,
    });
  };

  const isValid =
    clientName.trim().length >= 2 && clientEmail && validateEmail(clientEmail);

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-dark-800 mb-2">
          Conte-nos sobre seu negócio
        </h2>
        <p className="text-dark-500">
          Informações para personalizarmos sua proposta
        </p>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark-700 mb-2">
            Seu Nome *
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Como gostaria de ser chamado?"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-700 mb-2">
            E-mail *
          </label>
          <input
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            placeholder="seu@email.com"
            className={`w-full px-4 py-3 rounded-xl border transition-all ${
              clientEmail && !validateEmail(clientEmail)
                ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                : "border-gray-200 focus:border-primary focus:ring-primary/20"
            } focus:ring-2`}
          />
          {clientEmail && !validateEmail(clientEmail) && (
            <p className="text-red-500 text-sm mt-1">E-mail inválido</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-700 mb-2">
            WhatsApp
          </label>
          <input
            type="tel"
            value={clientPhone}
            onChange={handlePhoneChange}
            placeholder="(11) 99999-9999"
            maxLength={15}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-700 mb-2">
            Nome da Empresa
          </label>
          <input
            type="text"
            value={clientCompany}
            onChange={(e) => setClientCompany(e.target.value)}
            placeholder="Sua empresa ou projeto"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Segment Selection */}
      <div>
        <label className="block text-sm font-medium text-dark-700 mb-3">
          Segmento de Atuação
        </label>
        <div className="flex flex-wrap gap-2">
          {SEGMENTS.map((segment) => (
            <motion.button
              key={segment}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setClientSegment(segment)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                clientSegment === segment
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-dark-600 hover:bg-gray-200"
              }`}
            >
              {segment}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Challenges Selection */}
      <div>
        <label className="block text-sm font-medium text-dark-700 mb-3">
          Quais são seus principais desafios? (selecione quantos quiser)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CHALLENGES.map((challenge) => (
            <motion.button
              key={challenge.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleChallenge(challenge.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                challenges.includes(challenge.id)
                  ? "border-secondary bg-secondary/5"
                  : "border-gray-200 hover:border-secondary/50"
              }`}
            >
              <span className="text-2xl">{challenge.icon}</span>
              <span className="font-medium text-dark-700">
                {challenge.label}
              </span>
              {challenges.includes(challenge.id) && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto text-secondary"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Branding Question */}
      <div>
        <label className="block text-sm font-medium text-dark-700 mb-3">
          Você já tem uma identidade visual definida?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "sim", label: "Sim, completa", icon: "✅" },
            { id: "parcial", label: "Apenas o logo", icon: "🔄" },
            { id: "nao", label: "Não tenho ainda", icon: "🆕" },
          ].map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setHasBranding(option.id)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                hasBranding === option.id
                  ? "border-primary bg-primary-50"
                  : "border-gray-200 hover:border-primary/50"
              }`}
            >
              <span className="text-2xl block mb-2">{option.icon}</span>
              <span className="text-sm font-medium text-dark-700">
                {option.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="flex-1 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 text-dark-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
        >
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Voltar
        </motion.button>

        <motion.button
          whileHover={isValid ? { scale: 1.02 } : {}}
          whileTap={isValid ? { scale: 0.98 } : {}}
          onClick={handleSubmit}
          disabled={!isValid}
          className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
            isValid
              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continuar
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
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
