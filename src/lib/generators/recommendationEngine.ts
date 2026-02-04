import {
  SERVICES_CATALOG,
  getServiceById,
  ServiceConfig,
  ServiceOption,
} from "@/lib/config/services";

export interface RecommendationInput {
  service: string;
  serviceOption?: string;
  challenges: string[];
  budget: string;
  timeline: string;
  hasBranding?: string;
}

export interface PackageRecommendation {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  includes: string[];
  benefits: string[];
  deliveryTime: string;
  isRecommended?: boolean;
  tag?: string;
}

export interface RecommendationResult {
  recommendedPackage: PackageRecommendation;
  alternativePackages: PackageRecommendation[];
  combos: PackageRecommendation[];
  savings: {
    total: number;
    percentage: number;
  };
}

// Budget ranges mapping
const BUDGET_RANGES: Record<string, { min: number; max: number }> = {
  ate_500: { min: 0, max: 500 },
  "500_1000": { min: 500, max: 1000 },
  "1000_2000": { min: 1000, max: 2000 },
  "2000_5000": { min: 2000, max: 5000 },
  acima_5000: { min: 5000, max: Infinity },
};

// Challenge to service mapping for combos
const CHALLENGE_SERVICE_MAP: Record<string, string[]> = {
  visibility: ["gestao_social_simples", "criativos", "landing_page"],
  sales: ["landing_page", "site_institucional", "gestao_social_premium"],
  branding: ["criativos", "filmmaker", "gestao_social_intermediario"],
  engagement: ["edicao_reels", "gestao_social_intermediario", "criativos"],
  presence: ["site_institucional", "gestao_social_simples", "landing_page"],
  conversion: ["landing_page", "site_institucional", "gestao_social_premium"],
};

export function generateSmartRecommendation(
  input: RecommendationInput
): RecommendationResult {
  const service = getServiceById(input.service);
  if (!service) {
    throw new Error(`Serviço não encontrado: ${input.service}`);
  }

  const budgetRange = BUDGET_RANGES[input.budget] || { min: 0, max: Infinity };

  // 1. Determine o pacote principal recomendado
  const recommendedPackage = createPackageFromService(
    service,
    input.serviceOption,
    input.timeline
  );

  // 2. Gerar alternativas (versões mais simples ou avançadas)
  const alternativePackages = generateAlternatives(
    service,
    input.serviceOption,
    budgetRange
  );

  // 3. Gerar combos baseado nos desafios
  const combos = generateCombos(
    input.challenges,
    service,
    budgetRange,
    input.service
  );

  // 4. Calcular economia total se pegar combo
  const savings = calculateSavings(recommendedPackage, combos);

  return {
    recommendedPackage,
    alternativePackages,
    combos,
    savings,
  };
}

function createPackageFromService(
  service: ServiceConfig,
  optionId?: string,
  timeline?: string
): PackageRecommendation {
  let price = service.basePrice;
  let selectedOption: ServiceOption | undefined;

  // Se tiver opção específica, usar o preço dela
  if (optionId && service.options) {
    selectedOption = service.options.find((opt) => opt.id === optionId);
    if (selectedOption) {
      price = selectedOption.price;
    }
  }

  // Ajuste de preço por urgência
  let deliveryTime = service.deliveryTime;
  if (timeline === "urgente") {
    price = Math.round(price * 1.3); // +30% urgência
    deliveryTime = "Entrega expressa (até 3 dias)";
  } else if (timeline === "flexivel") {
    price = Math.round(price * 0.95); // -5% flexibilidade
    deliveryTime = "Prazo flexível (combinamos juntos)";
  }

  return {
    id: `${service.id}${optionId ? `-${optionId}` : ""}`,
    name: selectedOption ? `${service.name} - ${selectedOption.name}` : service.name,
    price,
    description: selectedOption?.description || `${service.name} profissional`,
    includes: service.includes,
    benefits: service.benefits,
    deliveryTime,
    isRecommended: true,
    tag: "Recomendado",
  };
}

function generateAlternatives(
  service: ServiceConfig,
  currentOptionId?: string,
  budgetRange?: { min: number; max: number }
): PackageRecommendation[] {
  const alternatives: PackageRecommendation[] = [];

  // Se o serviço tiver opções, mostrar as outras
  if (service.options && service.options.length > 1) {
    service.options.forEach((option) => {
      if (option.id !== currentOptionId) {
        const isWithinBudget =
          !budgetRange ||
          (option.price >= budgetRange.min * 0.5 &&
            option.price <= budgetRange.max * 1.2);

        if (isWithinBudget) {
          alternatives.push({
            id: `${service.id}-${option.id}`,
            name: `${service.name} - ${option.name}`,
            price: option.price,
            description: option.description || "",
            includes: service.includes,
            benefits: service.benefits,
            deliveryTime: service.deliveryTime,
            tag:
              option.price < (service.options?.[0]?.price || 0)
                ? "Econômico"
                : "Premium",
          });
        }
      }
    });
  }

  // Buscar serviços similares na mesma categoria
  const sameCategoryServices = SERVICES_CATALOG.filter(
    (s) => s.category === service.category && s.id !== service.id
  );

  sameCategoryServices.slice(0, 2).forEach((altService) => {
    const isWithinBudget =
      !budgetRange ||
      (altService.basePrice >= budgetRange.min * 0.5 &&
        altService.basePrice <= budgetRange.max * 1.2);

    if (isWithinBudget) {
      alternatives.push({
        id: altService.id,
        name: altService.name,
        price: altService.basePrice,
        description: `Alternativa: ${altService.name}`,
        includes: altService.includes,
        benefits: altService.benefits,
        deliveryTime: altService.deliveryTime,
        tag: "Alternativa",
      });
    }
  });

  return alternatives.slice(0, 3);
}

function generateCombos(
  challenges: string[],
  mainService: ServiceConfig,
  budgetRange: { min: number; max: number },
  mainServiceId: string
): PackageRecommendation[] {
  const combos: PackageRecommendation[] = [];
  const suggestedServices = new Set<string>();

  // Mapear desafios para serviços sugeridos
  challenges.forEach((challenge) => {
    const services = CHALLENGE_SERVICE_MAP[challenge] || [];
    services.forEach((s) => {
      if (s !== mainServiceId) {
        suggestedServices.add(s);
      }
    });
  });

  // Criar combos com os serviços sugeridos
  const suggestedServicesList = Array.from(suggestedServices);

  // Combo 1: Principal + 1 serviço complementar (10% desconto)
  if (suggestedServicesList.length >= 1) {
    const comboService = getServiceById(suggestedServicesList[0]);
    if (comboService) {
      const originalPrice = mainService.basePrice + comboService.basePrice;
      const discountedPrice = Math.round(originalPrice * 0.9);

      if (discountedPrice <= budgetRange.max * 1.3) {
        combos.push({
          id: `combo-${mainServiceId}-${comboService.id}`,
          name: `Combo Essencial`,
          price: discountedPrice,
          originalPrice,
          discount: 10,
          description: `${mainService.name} + ${comboService.name}`,
          includes: [
            ...mainService.includes.slice(0, 3),
            ...comboService.includes.slice(0, 3),
          ],
          benefits: [
            "Economia de 10% no pacote",
            "Estratégia integrada",
            "Prioridade no atendimento",
          ],
          deliveryTime: "Combinamos o melhor prazo",
          tag: "Combo Popular",
        });
      }
    }
  }

  // Combo 2: Principal + 2 serviços (15% desconto)
  if (suggestedServicesList.length >= 2) {
    const comboService1 = getServiceById(suggestedServicesList[0]);
    const comboService2 = getServiceById(suggestedServicesList[1]);

    if (comboService1 && comboService2) {
      const originalPrice =
        mainService.basePrice +
        comboService1.basePrice +
        comboService2.basePrice;
      const discountedPrice = Math.round(originalPrice * 0.85);

      if (discountedPrice <= budgetRange.max * 1.5) {
        combos.push({
          id: `combo-full-${mainServiceId}`,
          name: `Combo Completo`,
          price: discountedPrice,
          originalPrice,
          discount: 15,
          description: `${mainService.name} + ${comboService1.name} + ${comboService2.name}`,
          includes: [
            ...mainService.includes.slice(0, 2),
            ...comboService1.includes.slice(0, 2),
            ...comboService2.includes.slice(0, 2),
          ],
          benefits: [
            "Economia de 15% no pacote",
            "Solução completa para seu negócio",
            "Gerente de projeto dedicado",
            "Suporte prioritário 30 dias",
          ],
          deliveryTime: "Cronograma personalizado",
          tag: "Melhor Custo-Benefício",
          isRecommended: true,
        });
      }
    }
  }

  return combos;
}

function calculateSavings(
  mainPackage: PackageRecommendation,
  combos: PackageRecommendation[]
): { total: number; percentage: number } {
  if (combos.length === 0) {
    return { total: 0, percentage: 0 };
  }

  const bestCombo = combos.find((c) => c.discount) || combos[0];
  if (!bestCombo.originalPrice) {
    return { total: 0, percentage: 0 };
  }

  const total = bestCombo.originalPrice - bestCombo.price;
  const percentage = Math.round(
    (total / bestCombo.originalPrice) * 100
  );

  return { total, percentage };
}

// Helper para formatar preço em reais
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}
