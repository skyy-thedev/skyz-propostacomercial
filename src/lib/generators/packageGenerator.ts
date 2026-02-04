// Gerador de pacotes dinâmicos baseado no orçamento e tipo de projeto

import { PackageItem, DeliveryPhase } from "@/types/proposal.types";
import { getBudgetRange } from "@/lib/utils";

interface GeneratedPackages {
  packages: PackageItem[];
  recommended: number; // índice do pacote recomendado
}

export function generatePackages(
  budget: string,
  packagesNumber: string,
  objectives: string[]
): GeneratedPackages {
  const numPackages = parseInt(packagesNumber) || 3;
  const { min, max } = getBudgetRange(budget);

  // Determinar tipo de projeto baseado nos objetivos
  const projectType = determineProjectType(objectives);

  // Gerar pacotes baseados no tipo e orçamento
  const packages = createPackages(projectType, min, max, numPackages);

  // Recomendar o pacote intermediário ou o de melhor custo-benefício
  const recommended = numPackages === 3 ? 1 : 0;

  return { packages, recommended };
}

function determineProjectType(
  objectives: string[]
): "website" | "app" | "software" | "branding" {
  if (
    objectives.includes("product-development") ||
    objectives.includes("automation")
  ) {
    return "software";
  }
  if (objectives.includes("digital-presence") || objectives.includes("branding")) {
    return "website";
  }
  return "website"; // default
}

function createPackages(
  type: string,
  minBudget: number,
  maxBudget: number,
  numPackages: number
): PackageItem[] {
  const packages: PackageItem[] = [];

  // Calcular preços baseado no range
  const range = maxBudget - minBudget;
  const step = range / (numPackages + 1);

  const packageConfigs = getPackageConfigs(type);

  for (let i = 0; i < numPackages; i++) {
    const config = packageConfigs[i] || packageConfigs[packageConfigs.length - 1];
    const basePrice = minBudget + step * (i + 1);
    const price = Math.round(basePrice / 100) * 100; // Arredondar para centenas

    packages.push({
      name: config.name,
      description: config.description,
      price: price,
      originalPrice: i === numPackages - 1 ? Math.round(price * 1.15) : undefined,
      features: config.features,
      deliveryPhases: config.phases,
      recommended: i === Math.floor(numPackages / 2), // Recomendar o do meio
    });
  }

  return packages;
}

interface PackageConfig {
  name: string;
  description: string;
  features: string[];
  phases: DeliveryPhase[];
}

function getPackageConfigs(type: string): PackageConfig[] {
  const configs: Record<string, PackageConfig[]> = {
    website: [
      {
        name: "Essencial",
        description: "Solução ideal para estabelecer presença digital profissional",
        features: [
          "Design moderno e responsivo",
          "Até 5 páginas otimizadas",
          "Formulário de contato integrado",
          "Integração com redes sociais",
          "Otimização básica de SEO",
          "Hospedagem por 12 meses inclusa",
          "Certificado SSL gratuito",
          "Suporte técnico por 30 dias",
        ],
        phases: [
          {
            name: "Descoberta e Planejamento",
            description: "Briefing, pesquisa e wireframes",
            duration: "1 semana",
          },
          {
            name: "Design e Desenvolvimento",
            description: "Criação visual e programação",
            duration: "2 semanas",
          },
          {
            name: "Testes e Lançamento",
            description: "Revisões, ajustes e publicação",
            duration: "1 semana",
          },
        ],
      },
      {
        name: "Profissional",
        description: "Solução completa para empresas que buscam crescimento",
        features: [
          "Tudo do pacote Essencial",
          "Até 10 páginas personalizadas",
          "Blog integrado com CMS",
          "Painel administrativo intuitivo",
          "SEO avançado e Analytics",
          "Integração com Google Business",
          "Galeria de imagens/portfólio",
          "Chat de atendimento",
          "Hospedagem por 12 meses inclusa",
          "Suporte técnico por 90 dias",
        ],
        phases: [
          {
            name: "Descoberta e Estratégia",
            description: "Briefing aprofundado, pesquisa de mercado e arquitetura",
            duration: "1-2 semanas",
          },
          {
            name: "Design UX/UI",
            description: "Wireframes, protótipo navegável e design visual",
            duration: "2 semanas",
          },
          {
            name: "Desenvolvimento",
            description: "Programação frontend e backend, integrações",
            duration: "3 semanas",
          },
          {
            name: "Testes e Lançamento",
            description: "QA, otimizações e publicação",
            duration: "1 semana",
          },
        ],
      },
      {
        name: "Premium",
        description: "Solução enterprise para máximo impacto e conversão",
        features: [
          "Tudo do pacote Profissional",
          "Páginas ilimitadas",
          "E-commerce básico (até 50 produtos)",
          "Área de membros/clientes",
          "Integrações personalizadas (CRM, ERP)",
          "Landing pages de conversão",
          "Sistema de agendamento online",
          "Multi-idiomas",
          "Performance otimizada (Core Web Vitals)",
          "Hospedagem premium por 24 meses",
          "Suporte prioritário por 6 meses",
          "Treinamento completo da equipe",
        ],
        phases: [
          {
            name: "Descoberta e Estratégia",
            description: "Workshop de imersão, pesquisa UX e planejamento estratégico",
            duration: "2 semanas",
          },
          {
            name: "Design UX/UI",
            description: "Jornada do usuário, wireframes, protótipo interativo e design system",
            duration: "3 semanas",
          },
          {
            name: "Desenvolvimento Core",
            description: "Arquitetura, desenvolvimento frontend e backend",
            duration: "4 semanas",
          },
          {
            name: "Integrações e Funcionalidades",
            description: "APIs, automações e funcionalidades avançadas",
            duration: "2 semanas",
          },
          {
            name: "Testes, Otimização e Lançamento",
            description: "QA extensivo, performance e deploy",
            duration: "1 semana",
          },
        ],
      },
    ],
    software: [
      {
        name: "MVP",
        description: "Produto mínimo viável para validar sua solução no mercado",
        features: [
          "Análise de requisitos detalhada",
          "Até 5 módulos/funcionalidades core",
          "Interface web responsiva",
          "Dashboard básico",
          "Autenticação e controle de acesso",
          "Relatórios essenciais",
          "Documentação técnica",
          "Treinamento básico",
          "Suporte por 60 dias",
        ],
        phases: [
          {
            name: "Discovery e Especificação",
            description: "Levantamento de requisitos e documentação funcional",
            duration: "2 semanas",
          },
          {
            name: "Design e Arquitetura",
            description: "UX/UI e definição técnica",
            duration: "2 semanas",
          },
          {
            name: "Desenvolvimento",
            description: "Sprints de desenvolvimento ágil",
            duration: "4 semanas",
          },
          {
            name: "Testes e Deploy",
            description: "QA, homologação e publicação",
            duration: "1 semana",
          },
        ],
      },
      {
        name: "Profissional",
        description: "Sistema completo para automação robusta de processos",
        features: [
          "Tudo do pacote MVP",
          "Até 12 módulos/funcionalidades",
          "Integrações com sistemas existentes",
          "Workflow automatizado",
          "Notificações e alertas",
          "Relatórios avançados com exportação",
          "Dashboard gerencial completo",
          "Gestão de usuários e permissões",
          "API para integrações futuras",
          "Treinamento completo",
          "Suporte por 6 meses",
        ],
        phases: [
          {
            name: "Discovery e Especificação",
            description: "Imersão, mapeamento de processos e requisitos",
            duration: "2-3 semanas",
          },
          {
            name: "Design UX/UI",
            description: "Jornadas, wireframes e design system",
            duration: "3 semanas",
          },
          {
            name: "Desenvolvimento - Fase 1",
            description: "Módulos core e infraestrutura",
            duration: "4 semanas",
          },
          {
            name: "Desenvolvimento - Fase 2",
            description: "Módulos complementares e integrações",
            duration: "3 semanas",
          },
          {
            name: "Testes e Homologação",
            description: "QA, testes de usuário e ajustes",
            duration: "2 semanas",
          },
          {
            name: "Deploy e Treinamento",
            description: "Publicação e capacitação da equipe",
            duration: "1 semana",
          },
        ],
      },
      {
        name: "Enterprise",
        description: "Plataforma escalável para operações de alta complexidade",
        features: [
          "Tudo do pacote Profissional",
          "Módulos ilimitados",
          "App mobile complementar (iOS/Android)",
          "BI com dashboards avançados",
          "Inteligência artificial/automações",
          "Infraestrutura cloud escalável",
          "Multi-tenant (se aplicável)",
          "Monitoramento e alertas 24/7",
          "SLA garantido",
          "Documentação completa",
          "Suporte prioritário por 12 meses",
          "Manutenção evolutiva inclusa (3 meses)",
        ],
        phases: [
          {
            name: "Discovery Estratégico",
            description: "Workshop de imersão, mapeamento completo e roadmap",
            duration: "3 semanas",
          },
          {
            name: "Arquitetura e Design",
            description: "Arquitetura de solução, UX research e design system",
            duration: "4 semanas",
          },
          {
            name: "Desenvolvimento - Sprint 1",
            description: "Fundação, módulos core e infraestrutura",
            duration: "4 semanas",
          },
          {
            name: "Desenvolvimento - Sprint 2",
            description: "Módulos secundários e integrações",
            duration: "4 semanas",
          },
          {
            name: "Desenvolvimento - Sprint 3",
            description: "Funcionalidades avançadas e otimizações",
            duration: "3 semanas",
          },
          {
            name: "QA e Homologação",
            description: "Testes extensivos, segurança e performance",
            duration: "2 semanas",
          },
          {
            name: "Deploy e Capacitação",
            description: "Go-live, documentação e treinamentos",
            duration: "2 semanas",
          },
        ],
      },
    ],
    app: [
      {
        name: "MVP",
        description: "Aplicativo mínimo viável para validar sua ideia",
        features: [
          "Design de até 10 telas",
          "Desenvolvimento iOS ou Android",
          "Funcionalidades essenciais",
          "Backend básico",
          "Push notifications",
          "Publicação na loja",
          "Suporte por 60 dias",
        ],
        phases: [
          {
            name: "Discovery e UX",
            description: "Requisitos, jornadas e wireframes",
            duration: "2 semanas",
          },
          {
            name: "Design UI",
            description: "Design visual das telas",
            duration: "2 semanas",
          },
          {
            name: "Desenvolvimento",
            description: "Programação do app e backend",
            duration: "4 semanas",
          },
          {
            name: "Testes e Publicação",
            description: "QA, ajustes e envio para loja",
            duration: "2 semanas",
          },
        ],
      },
      {
        name: "Completo",
        description: "Aplicativo completo para uma plataforma",
        features: [
          "Tudo do pacote MVP",
          "Até 25 telas",
          "Backend robusto",
          "Painel administrativo web",
          "Integrações (pagamentos, maps, etc)",
          "Analytics integrado",
          "Suporte por 90 dias",
        ],
        phases: [
          {
            name: "Discovery e Estratégia",
            description: "Imersão, pesquisa e planejamento",
            duration: "2 semanas",
          },
          {
            name: "UX/UI Design",
            description: "Jornadas, wireframes e design completo",
            duration: "3 semanas",
          },
          {
            name: "Desenvolvimento App",
            description: "Programação do aplicativo",
            duration: "5 semanas",
          },
          {
            name: "Backend e Integrações",
            description: "APIs e integrações",
            duration: "3 semanas",
          },
          {
            name: "QA e Publicação",
            description: "Testes e publicação",
            duration: "2 semanas",
          },
        ],
      },
      {
        name: "Enterprise",
        description: "Solução multiplataforma para escala",
        features: [
          "Tudo do pacote Completo",
          "iOS e Android nativos",
          "Telas ilimitadas",
          "Integrações avançadas",
          "Escalabilidade cloud",
          "Monitoramento 24/7",
          "Suporte prioritário por 6 meses",
          "Manutenção evolutiva (3 meses)",
        ],
        phases: [
          {
            name: "Discovery Estratégico",
            description: "Workshop, pesquisa e roadmap",
            duration: "3 semanas",
          },
          {
            name: "UX/UI Design",
            description: "Design system e protótipos",
            duration: "4 semanas",
          },
          {
            name: "Desenvolvimento iOS",
            description: "App nativo iOS",
            duration: "5 semanas",
          },
          {
            name: "Desenvolvimento Android",
            description: "App nativo Android",
            duration: "5 semanas",
          },
          {
            name: "Backend e Infraestrutura",
            description: "APIs, integrações e cloud",
            duration: "4 semanas",
          },
          {
            name: "QA e Publicação",
            description: "Testes e publicação em ambas lojas",
            duration: "2 semanas",
          },
        ],
      },
    ],
    branding: [
      {
        name: "Essencial",
        description: "Identidade visual básica para sua marca",
        features: [
          "Logotipo principal",
          "Versões alternativas",
          "Paleta de cores",
          "Tipografia",
          "Manual básico de uso",
        ],
        phases: [
          {
            name: "Briefing e Pesquisa",
            description: "Entendimento da marca e mercado",
            duration: "1 semana",
          },
          {
            name: "Criação e Aprovação",
            description: "Desenvolvimento e refinamentos",
            duration: "2 semanas",
          },
        ],
      },
      {
        name: "Profissional",
        description: "Identidade visual completa",
        features: [
          "Tudo do Essencial",
          "Aplicações em papelaria",
          "Templates para redes sociais",
          "Apresentação institucional",
          "Manual completo de marca",
        ],
        phases: [
          {
            name: "Briefing e Pesquisa",
            description: "Imersão profunda na marca",
            duration: "1 semana",
          },
          {
            name: "Conceituação",
            description: "Desenvolvimento de conceitos",
            duration: "2 semanas",
          },
          {
            name: "Refinamento",
            description: "Ajustes e finalização",
            duration: "1 semana",
          },
          {
            name: "Aplicações",
            description: "Criação de materiais",
            duration: "1 semana",
          },
        ],
      },
      {
        name: "Premium",
        description: "Branding estratégico completo",
        features: [
          "Tudo do Profissional",
          "Estratégia de marca",
          "Tom de voz e messaging",
          "Design system completo",
          "Materiais de vendas",
          "Website institucional",
          "Suporte contínuo",
        ],
        phases: [
          {
            name: "Discovery Estratégico",
            description: "Workshop de marca e posicionamento",
            duration: "2 semanas",
          },
          {
            name: "Estratégia de Marca",
            description: "Plataforma de marca e messaging",
            duration: "2 semanas",
          },
          {
            name: "Identidade Visual",
            description: "Criação e design system",
            duration: "3 semanas",
          },
          {
            name: "Aplicações",
            description: "Materiais e website",
            duration: "3 semanas",
          },
        ],
      },
    ],
  };

  return configs[type] || configs.website;
}

export function calculateTimeline(packages: PackageItem[], selectedIndex: number): string {
  const selectedPackage = packages[selectedIndex];
  if (!selectedPackage) return "A definir";

  const totalWeeks = selectedPackage.deliveryPhases.reduce((total, phase) => {
    const match = phase.duration.match(/(\d+)/);
    if (match) {
      return total + parseInt(match[1]);
    }
    return total;
  }, 0);

  if (totalWeeks <= 4) {
    return `${totalWeeks} semanas`;
  } else {
    const months = Math.ceil(totalWeeks / 4);
    return `${months} ${months === 1 ? "mês" : "meses"} (${totalWeeks} semanas)`;
  }
}
