// Conteúdo e configurações da empresa Skyz Design BR

export const COMPANY_INFO = {
  name: "Skyz Design BR",
  legalName: "Skyz Design BR LTDA",
  instagram: "@skyzdesignbr",
  instagramUrl: "https://instagram.com/skyzdesignbr",
  email: "contato@skyzdesign.com.br",
  phone: "(11) 99999-9999",
  whatsapp: "5511999999999",
  website: "https://skyzdesign.com.br",
  cnpj: "00.000.000/0001-00",
};

export const COMPANY_ABOUT = {
  short: `A Skyz Design BR é uma empresa especializada em design e desenvolvimento de software que transforma ideias em soluções digitais de alto impacto.`,
  
  full: `A Skyz Design BR nasceu da paixão por criar experiências digitais excepcionais. Somos uma empresa especializada em design e desenvolvimento de software, comprometida em transformar a visão de nossos clientes em realidade digital.

Com uma equipe multidisciplinar de designers, desenvolvedores e estrategistas, combinamos criatividade com tecnologia de ponta para entregar soluções que não apenas atendem às expectativas, mas as superam.

Nossa abordagem centrada no usuário e metodologia ágil garantem que cada projeto seja desenvolvido com excelência, transparência e foco em resultados mensuráveis.`,
  
  mission: "Criar experiências digitais que impulsionam negócios e transformam a maneira como as empresas se conectam com seus clientes.",
  
  vision: "Ser referência em inovação digital, reconhecida pela qualidade excepcional e pelo impacto positivo nos negócios de nossos clientes.",
  
  values: [
    "Excelência em cada entrega",
    "Inovação constante",
    "Transparência e honestidade",
    "Foco no cliente",
    "Compromisso com resultados",
  ],
};

export const COMPANY_DIFFERENTIALS = [
  {
    title: "Metodologia Ágil",
    description: "Entregas incrementais com feedback contínuo, garantindo alinhamento constante com suas expectativas.",
    icon: "Zap",
  },
  {
    title: "Design Centrado no Usuário",
    description: "Soluções desenvolvidas com foco na experiência do usuário final, maximizando engajamento e conversão.",
    icon: "Users",
  },
  {
    title: "Stack Tecnológico Moderno",
    description: "Utilizamos as tecnologias mais modernas e escaláveis do mercado para garantir performance e longevidade.",
    icon: "Code2",
  },
  {
    title: "Suporte Dedicado",
    description: "Acompanhamento pós-entrega com suporte técnico e manutenção para garantir o sucesso contínuo do projeto.",
    icon: "HeadphonesIcon",
  },
  {
    title: "Transparência Total",
    description: "Comunicação clara e honesta em todas as etapas, sem surpresas no orçamento ou no cronograma.",
    icon: "Eye",
  },
  {
    title: "Resultados Mensuráveis",
    description: "Foco em métricas e KPIs que demonstram o retorno real do investimento em cada projeto.",
    icon: "TrendingUp",
  },
];

export const TECHNOLOGIES = [
  { name: "React.js / Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Linguagem" },
  { name: "Node.js", category: "Backend" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "PostgreSQL / MongoDB", category: "Database" },
  { name: "AWS / Vercel", category: "Cloud" },
  { name: "Figma", category: "Design" },
  { name: "Git / GitHub", category: "Versionamento" },
];

export const TESTIMONIALS = [
  {
    client: "Tech Solutions LTDA",
    clientLogo: null,
    contactName: "João Silva",
    contactRole: "CEO",
    challenge: "Modernizar plataforma legada que não suportava o crescimento da empresa",
    solution: "Migração completa para arquitetura moderna com React e Node.js, incluindo redesign da interface",
    result: "40% de aumento em conversões e 60% de redução no tempo de carregamento",
    quote: "A Skyz Design BR superou todas as nossas expectativas. O projeto foi entregue no prazo e os resultados foram impressionantes. Recomendo fortemente!",
  },
  {
    client: "Moda Express",
    clientLogo: null,
    contactName: "Maria Oliveira",
    contactRole: "Diretora de Marketing",
    challenge: "Criar presença digital forte para competir com grandes players do e-commerce",
    solution: "Desenvolvimento de e-commerce personalizado com foco em UX e integração com sistemas existentes",
    result: "Aumento de 150% nas vendas online nos primeiros 6 meses",
    quote: "Finalmente encontramos uma empresa que entende nossas necessidades. A Skyz transformou nossa visão em realidade e os números falam por si!",
  },
  {
    client: "HealthCare Plus",
    clientLogo: null,
    contactName: "Dr. Carlos Santos",
    contactRole: "Diretor Geral",
    challenge: "Automatizar processos manuais que consumiam muito tempo da equipe",
    solution: "Sistema de gestão personalizado com automação de workflows e relatórios inteligentes",
    result: "Redução de 70% no tempo gasto em tarefas administrativas",
    quote: "A automação desenvolvida pela Skyz revolucionou nossa operação. A equipe agora pode focar no que realmente importa: nossos pacientes.",
  },
];

export const SERVICE_PACKAGES = {
  website: {
    basic: {
      name: "Site Essencial",
      description: "Solução perfeita para estabelecer presença digital profissional",
      features: [
        "Design moderno e responsivo",
        "Até 5 páginas",
        "Formulário de contato",
        "Integração com redes sociais",
        "Otimização básica de SEO",
        "Hospedagem por 1 ano",
        "Suporte por 30 dias",
      ],
      notIncluded: [
        "Blog integrado",
        "Área de membros",
        "E-commerce",
        "Integrações avançadas",
      ],
    },
    professional: {
      name: "Site Profissional",
      description: "Solução completa para empresas que buscam mais funcionalidades",
      features: [
        "Tudo do pacote Essencial",
        "Até 10 páginas",
        "Blog integrado",
        "Painel administrativo",
        "SEO avançado",
        "Analytics integrado",
        "Hospedagem por 1 ano",
        "Suporte por 90 dias",
      ],
      notIncluded: [
        "E-commerce completo",
        "Área de membros",
        "Integrações personalizadas",
      ],
    },
    premium: {
      name: "Site Premium",
      description: "Solução enterprise para máximo impacto e funcionalidades",
      features: [
        "Tudo do pacote Profissional",
        "Páginas ilimitadas",
        "E-commerce básico",
        "Área de membros",
        "Integrações personalizadas",
        "Performance otimizada",
        "Hospedagem por 2 anos",
        "Suporte prioritário por 6 meses",
        "Treinamento da equipe",
      ],
      notIncluded: [],
    },
  },
  app: {
    basic: {
      name: "App MVP",
      description: "Produto mínimo viável para validar sua ideia no mercado",
      features: [
        "Design de até 10 telas",
        "Desenvolvimento iOS ou Android",
        "Funcionalidades essenciais",
        "Backend básico",
        "Publicação na loja",
        "Suporte por 60 dias",
      ],
      notIncluded: [
        "Versão para ambas plataformas",
        "Funcionalidades avançadas",
        "Integrações complexas",
      ],
    },
    professional: {
      name: "App Completo",
      description: "Aplicativo completo para uma plataforma com funcionalidades robustas",
      features: [
        "Tudo do pacote MVP",
        "Até 25 telas",
        "iOS ou Android (escolha)",
        "Backend completo",
        "Painel administrativo web",
        "Push notifications",
        "Analytics integrado",
        "Suporte por 90 dias",
      ],
      notIncluded: [
        "Versão para ambas plataformas",
        "Integrações muito complexas",
      ],
    },
    premium: {
      name: "App Enterprise",
      description: "Solução completa multiplataforma para escala",
      features: [
        "Tudo do pacote Completo",
        "iOS e Android",
        "Telas ilimitadas",
        "Integrações avançadas",
        "Escalabilidade cloud",
        "Monitoramento 24/7",
        "Suporte prioritário por 6 meses",
        "Manutenção evolutiva inclusa",
      ],
      notIncluded: [],
    },
  },
  software: {
    basic: {
      name: "Sistema Básico",
      description: "Automação essencial para processos específicos",
      features: [
        "Análise de requisitos",
        "Até 5 módulos",
        "Interface web responsiva",
        "Relatórios básicos",
        "Treinamento básico",
        "Suporte por 60 dias",
      ],
      notIncluded: [
        "Integrações complexas",
        "App mobile",
        "BI avançado",
      ],
    },
    professional: {
      name: "Sistema Profissional",
      description: "Solução robusta para automação completa de processos",
      features: [
        "Tudo do pacote Básico",
        "Até 12 módulos",
        "Integrações com sistemas existentes",
        "Relatórios avançados",
        "Dashboard gerencial",
        "Treinamento completo",
        "Suporte por 6 meses",
      ],
      notIncluded: [
        "App mobile nativo",
        "BI com IA",
      ],
    },
    premium: {
      name: "Sistema Enterprise",
      description: "Plataforma completa e escalável para grandes operações",
      features: [
        "Tudo do pacote Profissional",
        "Módulos ilimitados",
        "App mobile complementar",
        "BI com dashboards avançados",
        "Escalabilidade cloud",
        "SLA garantido",
        "Suporte prioritário por 12 meses",
        "Manutenção evolutiva inclusa",
      ],
      notIncluded: [],
    },
  },
};

export const PAYMENT_CONDITIONS = {
  discount: {
    percentage: 10,
    description: "Desconto para pagamento à vista",
  },
  installments: {
    maxInstallments: 12,
    description: "Parcelamento em até 12x",
  },
  entryOptions: [
    { entry: 30, installments: 3, description: "30% de entrada + 3x" },
    { entry: 40, installments: 2, description: "40% de entrada + 2x" },
    { entry: 50, installments: 1, description: "50% de entrada + 50% na entrega" },
  ],
};

export const PROPOSAL_VALIDITY_DAYS = 15;

export const TERMS_AND_CONDITIONS = [
  {
    title: "Validade da Proposta",
    content: `Esta proposta tem validade de ${PROPOSAL_VALIDITY_DAYS} dias corridos a partir da data de emissão.`,
  },
  {
    title: "Forma de Aceite",
    content: "O aceite desta proposta pode ser feito por e-mail ou através de assinatura digital.",
  },
  {
    title: "Propriedade Intelectual",
    content: "Todos os direitos de propriedade intelectual do projeto serão transferidos ao cliente após a quitação total do investimento.",
  },
  {
    title: "Garantia",
    content: "Oferecemos garantia de 30 a 180 dias (conforme pacote escolhido) para correção de bugs e ajustes menores após a entrega final.",
  },
  {
    title: "Suporte Pós-Entrega",
    content: "Suporte técnico incluso por período determinado no pacote escolhido. Após esse período, oferecemos planos de manutenção mensal.",
  },
  {
    title: "Cancelamento",
    content: "Em caso de cancelamento, serão cobrados os valores proporcionais às etapas já entregues e aprovadas.",
  },
];
