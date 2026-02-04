// Tipos principais do sistema de propostas comerciais

export interface ClientData {
  name: string;
  role: string;
  company: string;
  industry: string;
  email: string;
  phone: string;
  website?: string;
  linkedin?: string;
}

export interface DiagnosisData {
  mainObstacle: string;
  problemDuration: string;
  motivation: string;
  previousAttempts: string;
  whyFailed: string;
  consequences: string;
}

export interface SolutionData {
  idealSolution: string;
  objectives: string[];
  otherObjective?: string;
  beneficiaries: string;
  timeline: string;
  deadline?: string;
}

export interface CommercialData {
  budget: string;
  decisionMaker: string;
  approvalProcess: string;
  approvalDetails?: string;
  decisionFactors: string[];
  otherDecisionFactor?: string;
  packagesNumber: string;
}

export interface NextStepsData {
  responseTime: string;
  concerns?: string;
  wantsMeeting: string;
  meetingTime?: string;
  howFound: string;
  additionalNotes?: string;
}

export interface ProposalData {
  client: ClientData;
  diagnosis: DiagnosisData;
  solution: SolutionData;
  commercial: CommercialData;
  nextSteps: NextStepsData;
  proposalNumber?: string;
  createdAt?: string;
}

export interface PackageItem {
  name: string;
  price: number;
  originalPrice?: number;
  features: string[];
  deliveryPhases: DeliveryPhase[];
  recommended?: boolean;
  description: string;
}

export interface DeliveryPhase {
  name: string;
  description: string;
  duration: string;
}

export interface Testimonial {
  client: string;
  challenge: string;
  solution: string;
  result: string;
  quote: string;
}

export interface GeneratedProposal {
  id: string;
  proposalNumber: string;
  clientName: string;
  companyName: string;
  createdAt: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected';
  pdfUrl?: string;
  docxUrl?: string;
}

// Opções de dropdown/select
export const PROBLEM_DURATION_OPTIONS = [
  { value: 'less-3-months', label: 'Menos de 3 meses' },
  { value: '3-6-months', label: '3 a 6 meses' },
  { value: '6-12-months', label: '6 a 12 meses' },
  { value: 'more-1-year', label: 'Mais de 1 ano' },
];

export const OBJECTIVES_OPTIONS = [
  { value: 'increase-sales', label: 'Aumentar vendas/conversões' },
  { value: 'digital-presence', label: 'Melhorar presença digital' },
  { value: 'automation', label: 'Automatizar processos' },
  { value: 'reduce-costs', label: 'Reduzir custos operacionais' },
  { value: 'branding', label: 'Fortalecer marca/branding' },
  { value: 'product-development', label: 'Desenvolver produto/plataforma' },
];

export const BENEFICIARIES_OPTIONS = [
  { value: 'board', label: 'Diretoria' },
  { value: 'sales', label: 'Equipe de vendas' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'operations', label: 'Operacional' },
  { value: 'all', label: 'Toda empresa' },
];

export const TIMELINE_OPTIONS = [
  { value: 'urgent', label: 'Urgente (menos de 30 dias)' },
  { value: '1-3-months', label: '1 a 3 meses' },
  { value: '3-6-months', label: '3 a 6 meses' },
  { value: 'more-6-months', label: 'Acima de 6 meses' },
  { value: 'flexible', label: 'Flexível' },
];

export const BUDGET_OPTIONS = [
  { value: 'up-to-5k', label: 'Até R$ 5.000' },
  { value: '5k-15k', label: 'R$ 5.000 - R$ 15.000' },
  { value: '15k-30k', label: 'R$ 15.000 - R$ 30.000' },
  { value: '30k-50k', label: 'R$ 30.000 - R$ 50.000' },
  { value: 'above-50k', label: 'Acima de R$ 50.000' },
  { value: 'need-guidance', label: 'Preciso de orientação' },
];

export const DECISION_MAKER_OPTIONS = [
  { value: 'myself', label: 'Eu mesmo' },
  { value: 'partner', label: 'Sócio/Parceiro' },
  { value: 'committee', label: 'Comitê' },
  { value: 'board', label: 'Diretoria' },
  { value: 'other', label: 'Outro' },
];

export const DECISION_FACTORS_OPTIONS = [
  { value: 'deadline', label: 'Prazo de entrega' },
  { value: 'portfolio', label: 'Portfólio/Cases de sucesso' },
  { value: 'support', label: 'Suporte pós-entrega' },
  { value: 'technologies', label: 'Tecnologias utilizadas' },
  { value: 'payment-flexibility', label: 'Flexibilidade de pagamento' },
];

export const PACKAGES_NUMBER_OPTIONS = [
  { value: '2', label: '2 opções' },
  { value: '3', label: '3 opções (Básico, Intermediário, Premium)' },
];

export const RESPONSE_TIME_OPTIONS = [
  { value: '24-48h', label: '24-48 horas' },
  { value: '3-5-days', label: '3 a 5 dias' },
  { value: '1-week', label: '1 semana' },
  { value: 'no-rush', label: 'Sem pressa' },
];

export const MEETING_OPTIONS = [
  { value: 'yes', label: 'Sim' },
  { value: 'no', label: 'Não' },
  { value: 'maybe', label: 'Talvez' },
];

export const HOW_FOUND_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'referral', label: 'Indicação' },
  { value: 'google', label: 'Google' },
  { value: 'other', label: 'Outro' },
];
