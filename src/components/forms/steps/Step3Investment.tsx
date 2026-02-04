"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FormData } from "../OptimizedForm";
import { getServiceById } from "@/lib/config/services";

interface Step3InvestmentProps {
  onSubmit: (data: Partial<FormData>) => void;
  onBack: () => void;
  initialData: FormData;
  isSubmitting: boolean;
}

const BUDGET_RANGES = [
  { id: "ate_500", label: "Até R$ 500", range: [0, 500] },
  { id: "500_1000", label: "R$ 500 - R$ 1.000", range: [500, 1000] },
  { id: "1000_2000", label: "R$ 1.000 - R$ 2.000", range: [1000, 2000] },
  { id: "2000_5000", label: "R$ 2.000 - R$ 5.000", range: [2000, 5000] },
  { id: "acima_5000", label: "Acima de R$ 5.000", range: [5000, Infinity] },
];

const DELIVERY_METHODS = [
  { id: "google_drive", label: "Google Drive", icon: "📁" },
  { id: "wetransfer", label: "WeTransfer", icon: "🔗" },
  { id: "whatsapp", label: "WhatsApp", icon: "📱" },
  { id: "email", label: "E-mail", icon: "✉️" },
];

export default function Step3Investment({
  onSubmit,
  onBack,
  initialData,
  isSubmitting,
}: Step3InvestmentProps) {
  const [budget, setBudget] = useState(initialData.budget || "");
  const [deliveryMethod, setDeliveryMethod] = useState<string[]>(
    initialData.deliveryMethod || []
  );
  const [wantsMeeting, setWantsMeeting] = useState(
    initialData.wantsMeeting || ""
  );
  const [observations, setObservations] = useState(
    initialData.observations || ""
  );
  // V3: Opções de envio automático da proposta
  const [sendProposalByEmail, setSendProposalByEmail] = useState(true);
  const [sendProposalByWhatsApp, setSendProposalByWhatsApp] = useState(false);

  const service = initialData.service
    ? getServiceById(initialData.service)
    : null;

  const toggleDeliveryMethod = (methodId: string) => {
    setDeliveryMethod((prev) =>
      prev.includes(methodId)
        ? prev.filter((m) => m !== methodId)
        : [...prev, methodId]
    );
  };

  const handleSubmit = () => {
    if (!budget) return;

    onSubmit({
      budget,
      deliveryMethod,
      wantsMeeting,
      observations,
      // V3: Incluir opções de envio automático
      sendProposalByEmail,
      sendProposalByWhatsApp,
    });
  };

  const isValid = budget && wantsMeeting;

  // Price suggestion based on selected service
  const getSuggestedBudget = () => {
    if (!service) return null;
    const basePrice = service.basePrice;

    if (basePrice <= 500) return "ate_500";
    if (basePrice <= 1000) return "500_1000";
    if (basePrice <= 2000) return "1000_2000";
    if (basePrice <= 5000) return "2000_5000";
    return "acima_5000";
  };

  const suggestedBudget = getSuggestedBudget();

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-dark-800 mb-2">
          Investimento e Preferências
        </h2>
        <p className="text-dark-500">Último passo para sua proposta!</p>
      </div>

      {/* Summary Box */}
      {service && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4 border border-primary/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-500">Serviço selecionado:</p>
              <p className="font-semibold text-dark-800">{service.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-dark-500">A partir de:</p>
              <p className="font-bold text-primary text-lg">
                R$ {service.basePrice.toFixed(2).replace(".", ",")}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Budget Selection */}
      <div>
        <label className="block text-sm font-medium text-dark-700 mb-3">
          Qual seu orçamento disponível? *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BUDGET_RANGES.map((range) => (
            <motion.button
              key={range.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setBudget(range.id)}
              className={`p-4 rounded-xl border-2 text-center transition-all relative ${
                budget === range.id
                  ? "border-primary bg-primary-50"
                  : "border-gray-200 hover:border-primary/50"
              }`}
            >
              <span className="font-medium text-dark-700">{range.label}</span>
              {suggestedBudget === range.id && budget !== range.id && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs px-2 py-0.5 rounded-full">
                  Sugerido
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Delivery Method */}
      <div>
        <label className="block text-sm font-medium text-dark-700 mb-3">
          Como prefere receber os arquivos? (opcional)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DELIVERY_METHODS.map((method) => (
            <motion.button
              key={method.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleDeliveryMethod(method.id)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                deliveryMethod.includes(method.id)
                  ? "border-secondary bg-secondary/5"
                  : "border-gray-200 hover:border-secondary/50"
              }`}
            >
              <span className="text-2xl block mb-2">{method.icon}</span>
              <span className="text-sm font-medium text-dark-700">
                {method.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Meeting Preference */}
      <div>
        <label className="block text-sm font-medium text-dark-700 mb-3">
          Gostaria de uma reunião para alinhar detalhes? *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "sim", label: "Sim, prefiro alinhar", icon: "📞" },
            { id: "talvez", label: "Talvez, depois decidimos", icon: "🤔" },
            { id: "nao", label: "Não, pode seguir", icon: "🚀" },
          ].map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setWantsMeeting(option.id)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                wantsMeeting === option.id
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

      {/* Observations */}
      <div>
        <label className="block text-sm font-medium text-dark-700 mb-2">
          Algo mais que gostaria de nos contar? (opcional)
        </label>
        <textarea
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          placeholder="Detalhes adicionais, referências, inspirações..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
        />
      </div>

      {/* V3: Opções de Envio Automático da Proposta */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100"
      >
        <h3 className="font-semibold text-dark-800 mb-3 flex items-center gap-2">
          <span>📬</span> Envio Automático da Proposta
        </h3>
        <p className="text-sm text-dark-500 mb-4">
          Escolha como deseja receber sua proposta comercial personalizada:
        </p>
        
        <div className="space-y-3">
          {/* Email Option */}
          <label className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:border-primary transition-all">
            <input
              type="checkbox"
              checked={sendProposalByEmail}
              onChange={(e) => setSendProposalByEmail(e.target.checked)}
              className="w-5 h-5 text-primary rounded focus:ring-primary"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">✉️</span>
                <span className="font-medium text-dark-800">Receber por E-mail</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Recomendado
                </span>
              </div>
              <p className="text-xs text-dark-500 ml-7 mt-1">
                Proposta em PDF + link para visualização online
              </p>
            </div>
          </label>
          
          {/* WhatsApp Option */}
          <label className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:border-primary transition-all">
            <input
              type="checkbox"
              checked={sendProposalByWhatsApp}
              onChange={(e) => setSendProposalByWhatsApp(e.target.checked)}
              className="w-5 h-5 text-primary rounded focus:ring-primary"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">📱</span>
                <span className="font-medium text-dark-800">Receber por WhatsApp</span>
              </div>
              <p className="text-xs text-dark-500 ml-7 mt-1">
                Link direto para sua proposta via WhatsApp
              </p>
            </div>
          </label>
        </div>
        
        {!sendProposalByEmail && !sendProposalByWhatsApp && (
          <p className="text-xs text-amber-600 mt-3 flex items-center gap-1">
            <span>⚠️</span>
            Você pode acessar sua proposta diretamente após o envio
          </p>
        )}
      </motion.div>

      {/* Privacy Notice */}
      <div className="bg-gray-50 rounded-xl p-4 text-sm text-dark-500 flex items-start gap-3">
        <span className="text-xl">🔒</span>
        <p>
          Seus dados estão seguros conosco. Utilizamos as informações apenas
          para criar sua proposta personalizada e entrar em contato quando
          necessário.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 text-dark-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
          whileHover={isValid && !isSubmitting ? { scale: 1.02 } : {}}
          whileTap={isValid && !isSubmitting ? { scale: 0.98 } : {}}
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
            isValid && !isSubmitting
              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Gerando Proposta...
            </>
          ) : (
            <>
              Gerar Minha Proposta
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
