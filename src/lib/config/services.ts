// ============================================
// CATÁLOGO DE SERVIÇOS - SKYZ DESIGN BR
// Tabela de preços oficial atualizada V3
// ============================================

export interface CreativePackage {
  quantity: number;
  price: number;
  pricePerUnit: number;
  savings: number;
  badge?: string;
}

export interface ServiceOption {
  id: string;
  name: string;
  price: number;
  savings?: number;
  description: string;
  badge?: string;
  sections?: number | string;
  includes?: string[];
  idealFor?: string;
  deliveryTime?: string;
}

export interface ServiceConfig {
  id: string;
  category: "design" | "web";
  name: string;
  shortName: string;
  description: string;
  basePrice: number;
  maxPrice?: number;
  unit?: string;
  isRecurring?: boolean;
  options?: ServiceOption[];
  packages?: CreativePackage[];
  customPricing?: {
    enabled: boolean;
    minQuantity: number;
    pricePerUnit: number;
    label: string;
  };
  deliveryTime: string;
  includes: string[];
  benefits: string[];
}

// ============================================
// PACOTES DE CRIATIVOS (V3)
// ============================================

export const CREATIVE_PACKAGES: CreativePackage[] = [
  { quantity: 1, price: 60, pricePerUnit: 60, savings: 0 },
  { quantity: 3, price: 170, pricePerUnit: 56.67, savings: 10, badge: "Economia de R$ 10" },
  { quantity: 5, price: 260, pricePerUnit: 52, savings: 40, badge: "Mais popular" },
  { quantity: 10, price: 500, pricePerUnit: 50, savings: 100, badge: "Melhor custo-benefício" },
  { quantity: 15, price: 720, pricePerUnit: 48, savings: 180, badge: "Pacote profissional" },
  { quantity: 20, price: 920, pricePerUnit: 46, savings: 280, badge: "Pacote empresarial" },
];

export const CREATIVE_CUSTOM_PRICING = {
  enabled: true,
  minQuantity: 21,
  pricePerUnit: 45,
  label: "Mais de 20 criativos - R$ 45/unidade",
};

// ============================================
// OPÇÕES DE LANDING PAGE (V3)
// ============================================

export const LANDING_PAGE_OPTIONS: ServiceOption[] = [
  {
    id: "landing_basic",
    name: "Landing Page ESSENCIAL",
    price: 397,
    sections: 3,
    description: "Perfeita para captura de leads e ofertas simples",
    includes: [
      "3 seções customizadas (Hero + Benefícios + Formulário)",
      "Design responsivo (mobile + desktop)",
      "Formulário de captura de leads",
      "Integração com WhatsApp",
      "SEO básico",
      "Hospedagem incluída (1 ano)",
      "SSL (site seguro)",
      "1 revisão incluída",
    ],
    idealFor: "Lançamentos, captura de leads, validação de produto",
    deliveryTime: "5-7 dias úteis",
  },
  {
    id: "landing_pro",
    name: "Landing Page PROFISSIONAL",
    price: 697,
    sections: 6,
    badge: "Mais popular",
    description: "Completa para vendas e conversão otimizada",
    includes: [
      "6 seções customizadas",
      "Tudo do plano Essencial",
      "Seção de depoimentos",
      "Contador de urgência (opcional)",
      "FAQ accordion",
      "Múltiplos CTAs estratégicos",
      "Google Analytics configurado",
      "Pixel do Facebook/Meta",
      "Até 2 revisões incluídas",
    ],
    idealFor: "Infoprodutos, serviços, eventos, vendas online",
    deliveryTime: "7-10 dias úteis",
  },
  {
    id: "landing_premium",
    name: "Landing Page PREMIUM",
    price: 987,
    sections: "10-12",
    badge: "Melhor ROI",
    description: "Solução completa para alta conversão",
    includes: [
      "10-12 seções customizadas e estratégicas",
      "Tudo do plano Profissional",
      "Página de obrigado personalizada",
      "E-mail de boas-vindas automatizado",
      "Pop-up de captura (exit intent)",
      "Vídeo de apresentação integrado",
      "Seção de comparação de planos",
      "Chat ao vivo (integração)",
      "Otimização avançada de SEO",
      "Consultoria de copywriting",
      "Até 3 revisões incluídas",
    ],
    idealFor: "Lançamentos grandes, produtos premium, campanhas de alto investimento",
    deliveryTime: "10-15 dias úteis",
  },
];

// ============================================
// CATÁLOGO COMPLETO DE SERVIÇOS
// ============================================

export const SERVICES_CATALOG: ServiceConfig[] = [
  // ============================================
  // DESIGN & SOCIAL MEDIA
  // ============================================
  {
    id: "criativos",
    category: "design",
    name: "Criativos para Redes Sociais",
    shortName: "Criativos",
    description: "Posts profissionais para Instagram, Facebook e anúncios",
    basePrice: 60,
    unit: "criativo",
    packages: CREATIVE_PACKAGES,
    customPricing: CREATIVE_CUSTOM_PRICING,
    options: [
      {
        id: "1",
        name: "1 Criativo",
        price: 60,
        description: "1 arte personalizada para feed ou stories",
      },
      {
        id: "3",
        name: "3 Criativos",
        price: 170,
        savings: 10,
        description: "3 artes + economia de R$ 10",
      },
      {
        id: "5",
        name: "5 Criativos",
        price: 260,
        savings: 40,
        description: "5 artes + economia de R$ 40",
        badge: "Mais popular",
      },
      {
        id: "10",
        name: "10 Criativos",
        price: 500,
        savings: 100,
        description: "10 artes + economia de R$ 100",
        badge: "Melhor custo-benefício",
      },
      {
        id: "15",
        name: "15 Criativos",
        price: 720,
        savings: 180,
        description: "15 artes + economia de R$ 180",
      },
      {
        id: "20",
        name: "20 Criativos",
        price: 920,
        savings: 280,
        description: "20 artes + economia de R$ 280",
      },
      {
        id: "custom",
        name: "Quantidade Personalizada",
        price: 0,
        description: "Mais de 20 criativos - R$ 45/unidade",
      },
    ],
    deliveryTime: "3-5 dias úteis",
    includes: [
      "Design personalizado com sua identidade",
      "Até 2 revisões por criativo",
      "Formatos para feed e stories",
      "Arquivos em alta resolução (PNG/JPG)",
      "Versões para diferentes redes sociais",
    ],
    benefits: [
      "Mais engajamento nas redes sociais",
      "Identidade visual consistente",
      "Conteúdo pronto para publicar",
      "Economia de tempo na criação",
    ],
  },

  {
    id: "filmmaker",
    category: "design",
    name: "Filmmaker - Gravação Profissional",
    shortName: "Filmmaker",
    description: "Serviço de gravação com equipamento profissional",
    basePrice: 150,
    deliveryTime: "Conforme agendamento",
    includes: [
      "Gravação com equipamento 4K",
      "Iluminação profissional",
      "Captação de áudio limpo",
      "Até 3 horas de gravação",
      "Material bruto entregue",
    ],
    benefits: [
      "Qualidade cinematográfica",
      "Conteúdo profissional para redes",
      "Material versátil para edição",
      "Equipamento de ponta incluso",
    ],
  },

  {
    id: "edicao_reels",
    category: "design",
    name: "Edição de Reels",
    shortName: "Reels",
    description: "Edição de vídeos curtos até 5 minutos",
    basePrice: 150,
    maxPrice: 300,
    deliveryTime: "3-7 dias úteis",
    includes: [
      "Cortes dinâmicos e modernos",
      "Legendas animadas",
      "Música / efeitos sonoros",
      "Transições profissionais",
      "Até 2 revisões",
      "Formatação para Instagram/TikTok",
    ],
    benefits: [
      "Vídeos que prendem a atenção",
      "Otimizado para algoritmo",
      "Maior alcance orgânico",
      "Tendências atualizadas",
    ],
  },

  {
    id: "edicao_videoaulas",
    category: "design",
    name: "Edição de Videoaulas",
    shortName: "Videoaulas",
    description: "Edição completa de videoaulas a partir de 10 min",
    basePrice: 320,
    maxPrice: 840,
    deliveryTime: "5-10 dias úteis",
    includes: [
      "Cortes e limpeza de áudio",
      "Inserção de vinhetas",
      "Legendas / Closed Caption",
      "Animações de texto e gráficos",
      "Thumbnails personalizadas",
      "Até 3 revisões",
      "Exportação otimizada para EAD",
    ],
    benefits: [
      "Aulas mais profissionais",
      "Melhor retenção de alunos",
      "Pronto para plataformas EAD",
      "Qualidade de produção elevada",
    ],
  },

  {
    id: "gestao_social",
    category: "design",
    name: "Gestão de Social Media",
    shortName: "Gestão Social",
    description: "Gestão completa das suas redes sociais",
    basePrice: 700,
    unit: "mês",
    isRecurring: true,
    options: [
      {
        id: "simples",
        name: "Pacote SIMPLES",
        price: 700,
        description: "Gestão básica para quem está começando",
      },
      {
        id: "intermediario",
        name: "Pacote INTERMEDIÁRIO",
        price: 997,
        description: "Gestão completa com estratégia e divulgação",
        badge: "Mais popular",
      },
      {
        id: "premium",
        name: "Pacote PREMIUM",
        price: 1397,
        description: "Gestão estratégica completa + consultoria",
      },
    ],
    deliveryTime: "Mensal recorrente",
    includes: [
      "Correção de bio e links",
      "Posts mensais profissionais",
      "Planejamento de conteúdo",
      "Relatório de performance",
    ],
    benefits: [
      "Presença digital ativa e consistente",
      "Crescimento orgânico",
      "Economia de tempo",
      "Estratégia profissional",
    ],
  },

  // ============================================
  // DESENVOLVIMENTO WEB
  // ============================================
  {
    id: "landing_page",
    category: "web",
    name: "Landing Page / Página de Vendas",
    shortName: "Landing Page",
    description: "Página otimizada para conversão e captura de leads",
    basePrice: 397,
    options: LANDING_PAGE_OPTIONS,
    deliveryTime: "5-15 dias úteis",
    includes: [
      "Design responsivo (mobile + desktop)",
      "Formulário de captura de leads",
      "Integração com WhatsApp",
      "SEO básico configurado",
      "Hospedagem incluída (1 ano)",
      "Certificado SSL (site seguro)",
    ],
    benefits: [
      "Captura de leads 24/7",
      "Aumento de conversões",
      "Presença profissional online",
      "Rápido carregamento",
    ],
  },

  {
    id: "site_institucional",
    category: "web",
    name: "Site Institucional",
    shortName: "Site Institucional",
    description: "Site completo e profissional para sua empresa",
    basePrice: 900,
    deliveryTime: "15-20 dias úteis",
    includes: [
      "Design personalizado e exclusivo",
      "Até 6 páginas (Home, Sobre, Serviços, Portfolio, Blog, Contato)",
      "Painel administrativo fácil de usar",
      "Formulários de contato",
      "Integração com redes sociais",
      "Google Analytics configurado",
      "SEO otimizado",
      "Hospedagem (1 ano)",
      "E-mail profissional",
      "Até 3 revisões",
    ],
    benefits: [
      "Credibilidade profissional",
      "Controle total do conteúdo",
      "Visibilidade no Google",
      "Site próprio sem depender de redes",
    ],
  },

  {
    id: "sistema_saas",
    category: "web",
    name: "Sistema SaaS",
    shortName: "Sistema/SaaS",
    description: "Software como serviço customizado para seu negócio",
    basePrice: 2297,
    deliveryTime: "30-45 dias úteis",
    includes: [
      "MVP funcional completo",
      "Banco de dados estruturado",
      "Sistema de autenticação seguro",
      "Painel administrativo completo",
      "Dashboard com métricas",
      "Responsivo (web + mobile)",
      "Deploy em nuvem (AWS/Vercel)",
      "3 meses de suporte técnico",
      "Documentação técnica",
    ],
    benefits: [
      "Automatização de processos",
      "Escalabilidade infinita",
      "Produto digital próprio",
      "Receita recorrente potencial",
    ],
  },
];

// ============================================
// DETALHES DOS PACOTES DE GESTÃO SOCIAL
// ============================================

export const GESTAO_SOCIAL_DETAILS = {
  simples: {
    name: "Pacote SIMPLES",
    price: 700,
    posts: "2 a 4 posts mensais",
    includes: [
      "Correção de bio e links",
      "2 a 4 posts mensais",
      "Planejamento básico de conteúdo",
      "Relatório mensal simples",
      "Suporte via WhatsApp",
    ],
  },
  intermediario: {
    name: "Pacote INTERMEDIÁRIO",
    price: 997,
    posts: "4 a 6 posts mensais",
    includes: [
      "Tudo do pacote Simples",
      "+2 posts mensais (total 4-6)",
      "Linktree personalizado",
      "Stories semanais interativos",
      "Divulgação no @skyzdesignbr (6k+ seguidores)",
      "Relatório detalhado de métricas",
    ],
  },
  premium: {
    name: "Pacote PREMIUM",
    price: 1397,
    posts: "12 a 14 posts mensais",
    includes: [
      "Tudo do pacote Intermediário",
      "+8 posts mensais (total 12-14)",
      "Gestão estratégica de posicionamento digital",
      "Consultoria mensal de presença online",
      "Análise de concorrência",
      "Planejamento estratégico trimestral",
      "Prioridade no suporte",
    ],
  },
};

// ============================================
// SEGMENTOS DE NEGÓCIO
// ============================================

export const BUSINESS_SEGMENTS = [
  { value: "ecommerce", label: "E-commerce / Loja online" },
  { value: "infoprodutos", label: "Infoprodutos / Cursos" },
  { value: "servicos", label: "Serviços profissionais" },
  { value: "restaurante", label: "Restaurante / Food" },
  { value: "saude", label: "Saúde e bem-estar" },
  { value: "tecnologia", label: "Tecnologia" },
  { value: "moda", label: "Moda e beleza" },
  { value: "educacao", label: "Educação" },
  { value: "imobiliario", label: "Imobiliário" },
  { value: "fitness", label: "Fitness / Academia" },
  { value: "outro", label: "Outro" },
];

// ============================================
// DESAFIOS COMUNS
// ============================================

export const COMMON_CHALLENGES = [
  { value: "sem_presenca", label: "Não tenho presença digital / site" },
  { value: "instagram_nao_engaja", label: "Meu Instagram não engaja" },
  { value: "atrair_clientes", label: "Preciso atrair mais clientes" },
  { value: "sem_conteudo", label: "Não tenho conteúdo visual profissional" },
  { value: "site_desatualizado", label: "Meu site está desatualizado" },
  { value: "automatizar", label: "Quero automatizar processos" },
  { value: "vender_online", label: "Preciso vender online" },
  { value: "nao_sei_comecar", label: "Não sei por onde começar" },
];

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

export function getServiceById(id: string): ServiceConfig | undefined {
  return SERVICES_CATALOG.find((s) => s.id === id);
}

export function getServicesByCategory(
  category: "design" | "web"
): ServiceConfig[] {
  return SERVICES_CATALOG.filter((s) => s.category === category);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

export function getServiceOption(
  serviceId: string,
  optionId: string
): ServiceOption | undefined {
  const service = getServiceById(serviceId);
  return service?.options?.find((o) => o.id === optionId);
}
