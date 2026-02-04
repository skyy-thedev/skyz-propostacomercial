import { z } from "zod";

// Schema para Etapa 1: Dados do Cliente
export const clientDataSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo"),
  role: z
    .string()
    .min(2, "Cargo deve ter pelo menos 2 caracteres")
    .max(50, "Cargo muito longo"),
  company: z
    .string()
    .min(2, "Nome da empresa deve ter pelo menos 2 caracteres")
    .max(100, "Nome da empresa muito longo"),
  industry: z
    .string()
    .min(2, "Segmento deve ter pelo menos 2 caracteres")
    .max(50, "Segmento muito longo"),
  email: z.string().email("E-mail inválido"),
  phone: z
    .string()
    .min(10, "Telefone inválido")
    .max(20, "Telefone muito longo")
    .regex(
      /^[\d\s()+-]+$/,
      "Telefone deve conter apenas números, espaços e caracteres especiais"
    ),
  website: z
    .string()
    .url("URL inválida")
    .optional()
    .or(z.literal("")),
  linkedin: z
    .string()
    .url("URL do LinkedIn inválida")
    .optional()
    .or(z.literal("")),
});

// Schema para Etapa 2: Diagnóstico
export const diagnosisSchema = z.object({
  mainObstacle: z
    .string()
    .min(20, "Descreva o obstáculo com mais detalhes (mínimo 20 caracteres)")
    .max(1000, "Descrição muito longa"),
  problemDuration: z.string().min(1, "Selecione há quanto tempo enfrenta o problema"),
  motivation: z
    .string()
    .min(20, "Descreva a motivação com mais detalhes (mínimo 20 caracteres)")
    .max(1000, "Descrição muito longa"),
  previousAttempts: z
    .string()
    .min(10, "Descreva as tentativas anteriores (mínimo 10 caracteres)")
    .max(1000, "Descrição muito longa"),
  whyFailed: z
    .string()
    .min(10, "Explique por que não funcionaram (mínimo 10 caracteres)")
    .max(1000, "Descrição muito longa"),
  consequences: z
    .string()
    .min(20, "Descreva as consequências com mais detalhes (mínimo 20 caracteres)")
    .max(1000, "Descrição muito longa"),
});

// Schema para Etapa 3: Solução
export const solutionSchema = z.object({
  idealSolution: z
    .string()
    .min(20, "Descreva a solução ideal com mais detalhes (mínimo 20 caracteres)")
    .max(1000, "Descrição muito longa"),
  objectives: z
    .array(z.string())
    .min(1, "Selecione pelo menos um objetivo"),
  otherObjective: z.string().optional(),
  beneficiaries: z.string().min(1, "Selecione quem se beneficiará"),
  timeline: z.string().min(1, "Selecione o prazo ideal"),
  deadline: z.string().optional(),
});

// Schema para Etapa 4: Comercial
export const commercialSchema = z.object({
  budget: z.string().min(1, "Selecione o orçamento estimado"),
  decisionMaker: z.string().min(1, "Selecione o responsável pela decisão"),
  approvalProcess: z.string().min(1, "Informe sobre o processo de aprovação"),
  approvalDetails: z.string().optional(),
  decisionFactors: z.array(z.string()).min(1, "Selecione pelo menos um fator"),
  otherDecisionFactor: z.string().optional(),
  packagesNumber: z.string().min(1, "Selecione quantas opções deseja"),
});

// Schema para Etapa 5: Próximos Passos
export const nextStepsSchema = z.object({
  responseTime: z.string().min(1, "Selecione o prazo para retorno"),
  concerns: z.string().optional(),
  wantsMeeting: z.string().min(1, "Informe se deseja agendar reunião"),
  meetingTime: z.string().optional(),
  howFound: z.string().min(1, "Selecione como nos conheceu"),
  additionalNotes: z.string().max(2000, "Observações muito longas").optional(),
});

// Schema completo da proposta
export const proposalDataSchema = z.object({
  client: clientDataSchema,
  diagnosis: diagnosisSchema,
  solution: solutionSchema,
  commercial: commercialSchema,
  nextSteps: nextStepsSchema,
});

// Types inferidos dos schemas
export type ClientDataFormValues = z.infer<typeof clientDataSchema>;
export type DiagnosisFormValues = z.infer<typeof diagnosisSchema>;
export type SolutionFormValues = z.infer<typeof solutionSchema>;
export type CommercialFormValues = z.infer<typeof commercialSchema>;
export type NextStepsFormValues = z.infer<typeof nextStepsSchema>;
export type ProposalFormValues = z.infer<typeof proposalDataSchema>;

// Valores padrão para cada etapa
export const defaultClientData: ClientDataFormValues = {
  name: "",
  role: "",
  company: "",
  industry: "",
  email: "",
  phone: "",
  website: "",
  linkedin: "",
};

export const defaultDiagnosis: DiagnosisFormValues = {
  mainObstacle: "",
  problemDuration: "",
  motivation: "",
  previousAttempts: "",
  whyFailed: "",
  consequences: "",
};

export const defaultSolution: SolutionFormValues = {
  idealSolution: "",
  objectives: [],
  otherObjective: "",
  beneficiaries: "",
  timeline: "",
  deadline: "",
};

export const defaultCommercial: CommercialFormValues = {
  budget: "",
  decisionMaker: "",
  approvalProcess: "",
  approvalDetails: "",
  decisionFactors: [],
  otherDecisionFactor: "",
  packagesNumber: "3",
};

export const defaultNextSteps: NextStepsFormValues = {
  responseTime: "",
  concerns: "",
  wantsMeeting: "",
  meetingTime: "",
  howFound: "",
  additionalNotes: "",
};

export const defaultProposalData: ProposalFormValues = {
  client: defaultClientData,
  diagnosis: defaultDiagnosis,
  solution: defaultSolution,
  commercial: defaultCommercial,
  nextSteps: defaultNextSteps,
};
