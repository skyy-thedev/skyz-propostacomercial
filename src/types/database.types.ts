// Tipo para proposta do banco de dados (parsed)
export interface ProposalFromDB {
  id: string;
  proposalNumber: string;
  
  // Cliente
  clientName: string;
  clientRole: string;
  clientCompany: string;
  clientIndustry: string;
  clientEmail: string;
  clientPhone: string;
  clientWebsite: string | null;
  clientLinkedin: string | null;
  
  // Diagnóstico
  mainObstacle: string;
  problemDuration: string;
  motivation: string;
  previousAttempts: string;
  whyFailed: string;
  consequences: string;
  
  // Solução
  idealSolution: string;
  objectives: string[];
  beneficiaries: string;
  timeline: string;
  deadline: string | null;
  
  // Comercial
  budget: string;
  decisionMaker: string;
  approvalProcess: boolean;
  approvalDetails: string | null;
  decisionFactors: string[];
  packagesNumber: number;
  selectedPackage: string | null;
  
  // Próximos Passos
  responseTime: string;
  concerns: string | null;
  wantsMeeting: boolean;
  meetingTime: string | null;
  howFound: string;
  additionalNotes: string | null;
  
  // Pacotes
  packages: GeneratedPackage[];
  
  // Metadados
  status: "DRAFT" | "SENT" | "VIEWED" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  createdAt: string;
  updatedAt: string;
  validUntil: string;
  viewCount: number;
  lastViewedAt: string | null;
}

export interface GeneratedPackage {
  name: string;
  price: number;
  description: string;
  features: string[];
  timeline: string;
  isRecommended?: boolean;
}
