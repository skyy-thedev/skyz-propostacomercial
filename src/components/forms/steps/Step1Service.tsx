"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  SERVICES_CATALOG, 
  getServicesByCategory, 
  ServiceConfig,
  CREATIVE_PACKAGES,
  CREATIVE_CUSTOM_PRICING,
  LANDING_PAGE_OPTIONS
} from "@/lib/config/services";
import { FormData } from "../OptimizedForm";

interface Step1ServiceProps {
  onNext: (data: Partial<FormData>) => void;
  initialData: FormData;
}

type Category = "design" | "web";

const CATEGORIES = [
  {
    id: "design" as Category,
    name: "Design & Social Media",
    icon: "🎨",
    description: "Criativos, edição de vídeos, gestão de redes sociais",
  },
  {
    id: "web" as Category,
    name: "Desenvolvimento Web",
    icon: "💻",
    description: "Landing pages, sites institucionais, sistemas",
  },
];

const TIMELINE_OPTIONS = [
  { id: "urgente", label: "Urgente (até 3 dias)", icon: "🚀" },
  { id: "normal", label: "Normal (1-2 semanas)", icon: "📅" },
  { id: "flexivel", label: "Flexível (sem pressa)", icon: "🌿" },
];

export default function Step1Service({ onNext, initialData }: Step1ServiceProps) {
  const [category, setCategory] = useState<Category | undefined>(
    initialData.category
  );
  const [selectedService, setSelectedService] = useState<string | undefined>(
    initialData.service
  );
  const [serviceOption, setServiceOption] = useState<string | undefined>(
    initialData.serviceOption
  );
  const [customQuantity, setCustomQuantity] = useState<string>("");
  const [timeline, setTimeline] = useState<string | undefined>(
    initialData.timeline
  );

  const services = category ? getServicesByCategory(category) : [];
  const currentService = services.find((s) => s.id === selectedService);

  const handleCategorySelect = (cat: Category) => {
    setCategory(cat);
    setSelectedService(undefined);
    setServiceOption(undefined);
    setCustomQuantity("");
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setServiceOption(undefined);
    setCustomQuantity("");
  };

  const handleSubmit = () => {
    if (!category || !selectedService || !timeline) return;

    // Para criativos customizados, incluir quantidade no option
    let finalOption = serviceOption;
    if (selectedService === "criativos" && serviceOption === "custom" && customQuantity) {
      finalOption = `custom_${customQuantity}`;
    }

    onNext({
      category,
      service: selectedService,
      serviceOption: finalOption,
      timeline,
    });
  };

  const isValid = category && selectedService && timeline && 
    (selectedService !== "criativos" || serviceOption) &&
    (serviceOption !== "custom" || (customQuantity && parseInt(customQuantity) >= 21));

  // Calcular preço customizado de criativos
  const getCustomPrice = () => {
    const qty = parseInt(customQuantity);
    if (qty >= 21) {
      return qty * CREATIVE_CUSTOM_PRICING.pricePerUnit;
    }
    return 0;
  };

  const getCustomSavings = () => {
    const qty = parseInt(customQuantity);
    if (qty >= 21) {
      return qty * 60 - qty * CREATIVE_CUSTOM_PRICING.pricePerUnit;
    }
    return 0;
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-dark-800 mb-2">
          O que você precisa?
        </h2>
        <p className="text-dark-500">
          Selecione a categoria e o serviço desejado
        </p>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-dark-700 mb-3">
          Categoria do Serviço *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategorySelect(cat.id)}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                category === cat.id
                  ? "border-primary bg-primary-50 shadow-lg"
                  : "border-gray-200 hover:border-primary/50"
              }`}
            >
              <span className="text-4xl mb-3 block">{cat.icon}</span>
              <h3 className="font-semibold text-dark-800 mb-1">{cat.name}</h3>
              <p className="text-sm text-dark-500">{cat.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Service Selection */}
      {category && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="block text-sm font-medium text-dark-700 mb-3">
            Serviço Desejado *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((service) => (
              <motion.button
                key={service.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleServiceSelect(service.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedService === service.id
                    ? "border-primary bg-primary-50"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-dark-800">
                      {service.name}
                    </h4>
                    <p className="text-sm text-dark-500 mt-1">
                      A partir de{" "}
                      <span className="text-primary font-semibold">
                        R$ {service.basePrice.toFixed(2).replace(".", ",")}
                      </span>
                    </p>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-dark-500">
                    {service.deliveryTime}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ============================================ */}
      {/* CRIATIVOS - Seleção de Quantidade (V3) */}
      {/* ============================================ */}
      {selectedService === "criativos" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="font-semibold text-dark-800">
            Quantos criativos você precisa?
          </h3>

          {/* Opções pré-definidas */}
          <div className="grid md:grid-cols-2 gap-3">
            {CREATIVE_PACKAGES.map((pkg) => (
              <label
                key={pkg.quantity}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  serviceOption === String(pkg.quantity)
                    ? "border-primary bg-primary-50 shadow-md"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                {pkg.badge === "Mais popular" && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    Mais popular
                  </span>
                )}
                {pkg.badge === "Melhor custo-benefício" && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs px-2 py-1 rounded-full font-semibold">
                    Melhor valor
                  </span>
                )}

                <input
                  type="radio"
                  name="creativesQty"
                  value={pkg.quantity}
                  checked={serviceOption === String(pkg.quantity)}
                  onChange={(e) => {
                    setServiceOption(e.target.value);
                    setCustomQuantity("");
                  }}
                  className="sr-only"
                />

                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg text-dark-800">
                    {pkg.quantity} {pkg.quantity === 1 ? "criativo" : "criativos"}
                  </span>
                  <span className="text-sm text-dark-500">
                    R$ {pkg.pricePerUnit.toFixed(2).replace(".", ",")}/un
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    R$ {pkg.price.toFixed(0)}
                  </span>
                  {pkg.savings > 0 && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Economize R$ {pkg.savings}
                    </span>
                  )}
                </div>
              </label>
            ))}
          </div>

          {/* Opção Personalizada */}
          <div className="mt-4">
            <label
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                serviceOption === "custom"
                  ? "border-primary bg-primary-50"
                  : "border-gray-200 hover:border-primary/50"
              }`}
            >
              <input
                type="radio"
                name="creativesQty"
                value="custom"
                checked={serviceOption === "custom"}
                onChange={(e) => setServiceOption(e.target.value)}
                className="w-5 h-5 text-primary"
              />
              <div className="flex-1">
                <span className="font-semibold text-dark-800">
                  Quantidade personalizada (mais de 20)
                </span>
                <p className="text-sm text-dark-500">R$ 45 por criativo</p>
              </div>
            </label>

            {serviceOption === "custom" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 p-4 bg-gray-50 rounded-xl"
              >
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Quantos criativos você precisa?
                </label>
                <input
                  type="number"
                  min="21"
                  placeholder="Ex: 30"
                  value={customQuantity}
                  onChange={(e) => setCustomQuantity(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                />
                {customQuantity && parseInt(customQuantity) >= 21 && (
                  <p className="mt-2 text-sm text-dark-600">
                    Total:{" "}
                    <strong className="text-primary text-lg">
                      R$ {getCustomPrice().toFixed(0)}
                    </strong>
                    <span className="ml-2 text-green-600">
                      (Economia de R$ {getCustomSavings().toFixed(0)})
                    </span>
                  </p>
                )}
                {customQuantity && parseInt(customQuantity) < 21 && (
                  <p className="mt-2 text-sm text-red-500">
                    Mínimo de 21 criativos para quantidade personalizada
                  </p>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* ============================================ */}
      {/* LANDING PAGE - 3 Níveis (V3) */}
      {/* ============================================ */}
      {selectedService === "landing_page" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="font-semibold text-dark-800 mb-4">
            Escolha o nível da sua Landing Page:
          </h3>

          <div className="grid gap-4">
            {LANDING_PAGE_OPTIONS.map((option) => {
              const colors = {
                landing_basic: { border: "primary", bg: "primary" },
                landing_pro: { border: "purple-600", bg: "purple" },
                landing_premium: { border: "amber-600", bg: "amber" },
              };
              const colorKey = option.id as keyof typeof colors;
              
              return (
                <label
                  key={option.id}
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    serviceOption === option.id
                      ? option.id === "landing_basic"
                        ? "border-primary bg-primary-50"
                        : option.id === "landing_pro"
                        ? "border-purple-600 bg-purple-50"
                        : "border-amber-600 bg-amber-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {option.badge && (
                    <span
                      className={`absolute -top-2 -right-2 text-white text-xs px-3 py-1 rounded-full font-semibold ${
                        option.badge === "Mais popular"
                          ? "bg-green-500"
                          : "bg-amber-500"
                      }`}
                    >
                      {option.badge}
                    </span>
                  )}

                  <input
                    type="radio"
                    name="landingOption"
                    value={option.id}
                    checked={serviceOption === option.id}
                    onChange={(e) => setServiceOption(e.target.value)}
                    className="sr-only"
                  />

                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-xl font-bold text-dark-800">
                        {option.name.replace("Landing Page ", "")}
                      </h4>
                      <p className="text-sm text-dark-500">
                        {option.sections} seções - {option.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-3xl font-bold ${
                          option.id === "landing_basic"
                            ? "text-primary"
                            : option.id === "landing_pro"
                            ? "text-purple-600"
                            : "text-amber-600"
                        }`}
                      >
                        R$ {option.price}
                      </p>
                      <p className="text-xs text-dark-500">{option.deliveryTime}</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-dark-600">
                    {option.includes?.slice(0, 3).map((item, idx) => (
                      <p key={idx}>✓ {item}</p>
                    ))}
                  </div>

                  {option.idealFor && (
                    <p className="mt-3 text-xs text-dark-500 italic">
                      Ideal para: {option.idealFor}
                    </p>
                  )}
                </label>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ============================================ */}
      {/* Opções padrão para outros serviços */}
      {/* ============================================ */}
      {currentService?.options && 
       currentService.options.length > 0 && 
       selectedService !== "criativos" && 
       selectedService !== "landing_page" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="block text-sm font-medium text-dark-700 mb-3">
            Escolha uma opção
          </label>
          <div className="grid grid-cols-1 gap-3">
            {currentService.options.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setServiceOption(option.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  serviceOption === option.id
                    ? "border-secondary bg-secondary/5"
                    : "border-gray-200 hover:border-secondary/50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-dark-800">{option.name}</h4>
                    {option.description && (
                      <p className="text-sm text-dark-500 mt-1">
                        {option.description}
                      </p>
                    )}
                  </div>
                  {option.badge && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full mr-2">
                      {option.badge}
                    </span>
                  )}
                  <span className="text-secondary font-bold">
                    R$ {option.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Timeline Selection */}
      {selectedService && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="block text-sm font-medium text-dark-700 mb-3">
            Prazo Desejado *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TIMELINE_OPTIONS.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTimeline(option.id)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  timeline === option.id
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
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        whileHover={isValid ? { scale: 1.02 } : {}}
        whileTap={isValid ? { scale: 0.98 } : {}}
        onClick={handleSubmit}
        disabled={!isValid}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
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
  );
}
