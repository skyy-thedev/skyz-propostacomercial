# PROMPT DE ATUALIZAÇÃO - NOVA FEATURE: VISUALIZAÇÃO DE PROPOSTA EM PÁGINA DEDICADA
## Para Claude Opus 4.5 - Migração de PDF/DOCX para Visualização Web

---

## 🎯 CONTEXTO DA MUDANÇA

Você desenvolveu anteriormente um sistema de automação de propostas comerciais que gera arquivos PDF e DOCX após o preenchimento do formulário.

**MUDANÇA ESTRATÉGICA:**
Precisamos **priorizar a visualização web** da proposta em uma página dedicada e tornar os downloads (PDF/DOCX) **opcionais/secundários**.

### ❌ VERSÃO ANTERIOR (O que remover/alterar):
- Geração imediata de PDF/DOCX após submissão
- Downloads como ação principal
- Visualização apenas após download

### ✅ NOVA VERSÃO (O que implementar):
- **Salvar proposta no banco de dados** com ID único
- **Redirecionar para página de visualização** em `/:id`
- **Renderizar proposta completa** diretamente no navegador (HTML/React)
- **Botões opcionais** de download (PDF/DOCX) na página
- **URL compartilhável** da proposta
- **Design profissional** para impressão (print-friendly)

---

## 🏗️ ARQUITETURA DA NOVA SOLUÇÃO

### **Fluxo do Usuário Atualizado:**

```
[Formulário Multi-Etapas]
         ↓
    [Submissão]
         ↓
[Salvar no Banco de Dados] → Gera ID único (ex: prop_abc123xyz)
         ↓
[Redirecionar para /:id] → Ex: /prop_abc123xyz
         ↓
[Página de Visualização]
    ├─ Renderização completa da proposta (HTML/React)
    ├─ Design profissional e responsivo
    ├─ Botão: 📥 Baixar PDF (opcional)
    ├─ Botão: 📄 Baixar DOCX (opcional)
    ├─ Botão: 🔗 Copiar Link
    └─ Botão: 📧 Enviar por E-mail (opcional)
```

---

## 📊 ESTRUTURA DO BANCO DE DADOS

### **Schema: Proposals**

```typescript
// /prisma/schema.prisma (ou equivalente)

model Proposal {
  id              String   @id @default(cuid()) // Ex: "clxyz123abc..."
  proposalNumber  String   @unique // Ex: "PROP-2024-001"
  
  // Dados do Cliente
  clientName      String
  clientRole      String
  clientCompany   String
  clientIndustry  String
  clientEmail     String
  clientPhone     String
  clientWebsite   String?
  clientLinkedin  String?
  
  // Diagnóstico
  mainObstacle       String   @db.Text
  problemDuration    String
  motivation         String   @db.Text
  previousAttempts   String   @db.Text
  whyFailed          String   @db.Text
  consequences       String   @db.Text
  
  // Solução
  idealSolution   String   @db.Text
  objectives      Json     // Array de strings
  beneficiaries   String
  timeline        String
  deadline        String?
  
  // Comercial
  budget              String
  decisionMaker       String
  approvalProcess     Boolean
  approvalDetails     String?
  decisionFactors     Json     // Array de strings
  packagesNumber      Int
  selectedPackage     String?  // Para quando cliente escolher
  
  // Próximos Passos
  responseTime     String
  concerns         String?
  wantsMeeting     Boolean
  meetingTime      String?
  howFound         String
  additionalNotes  String?
  
  // Pacotes Gerados (JSON)
  packages         Json     // Array de objetos { name, price, features, etc }
  
  // Metadados
  status           ProposalStatus @default(SENT)
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
  validUntil       DateTime       // Data de validade
  viewCount        Int            @default(0)
  lastViewedAt     DateTime?
  
  // Arquivos (se gerados)
  pdfUrl           String?
  docxUrl          String?
  
  @@index([clientEmail])
  @@index([createdAt])
}

enum ProposalStatus {
  DRAFT      // Rascunho
  SENT       // Enviada
  VIEWED     // Visualizada pelo cliente
  ACCEPTED   // Aceita
  REJECTED   // Recusada
  EXPIRED    // Expirada
}
```

---

## 🎨 NOVA ESTRUTURA DE ROTAS

### **Rotas do App:**

```
/                          → Landing page + Formulário
/api/proposals/create      → POST - Criar proposta e retornar ID
/api/proposals/[id]        → GET - Buscar dados da proposta
/api/proposals/[id]/pdf    → GET - Gerar e baixar PDF
/api/proposals/[id]/docx   → GET - Gerar e baixar DOCX
/api/proposals/[id]/track  → POST - Registrar visualização
/[id]                      → Página de visualização da proposta
/admin (opcional)          → Dashboard de gestão
```

---

## 💻 IMPLEMENTAÇÃO DETALHADA

### **PASSO 1: Atualizar API de Criação**

#### **/app/api/proposals/create/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateProposalNumber } from '@/lib/utils';
import { generatePackages } from '@/lib/proposal-logic';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Valide os dados
    // ... validação com Zod
    
    // Gere número da proposta
    const proposalNumber = await generateProposalNumber(); // Ex: PROP-2024-001
    
    // Gere pacotes baseado no orçamento
    const packages = generatePackages(
      data.commercial.budget, 
      data.commercial.packagesNumber
    );
    
    // Calcule data de validade (15 dias)
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 15);
    
    // Salve no banco
    const proposal = await prisma.proposal.create({
      data: {
        proposalNumber,
        // Cliente
        clientName: data.client.name,
        clientRole: data.client.role,
        clientCompany: data.client.company,
        clientIndustry: data.client.industry,
        clientEmail: data.client.email,
        clientPhone: data.client.phone,
        clientWebsite: data.client.website,
        clientLinkedin: data.client.linkedin,
        
        // Diagnóstico
        mainObstacle: data.diagnosis.mainObstacle,
        problemDuration: data.diagnosis.problemDuration,
        motivation: data.diagnosis.motivation,
        previousAttempts: data.diagnosis.previousAttempts,
        whyFailed: data.diagnosis.whyFailed,
        consequences: data.diagnosis.consequences,
        
        // Solução
        idealSolution: data.solution.idealSolution,
        objectives: data.solution.objectives,
        beneficiaries: data.solution.beneficiaries,
        timeline: data.solution.timeline,
        deadline: data.solution.deadline,
        
        // Comercial
        budget: data.commercial.budget,
        decisionMaker: data.commercial.decisionMaker,
        approvalProcess: data.commercial.approvalProcess,
        approvalDetails: data.commercial.approvalDetails,
        decisionFactors: data.commercial.decisionFactors,
        packagesNumber: data.commercial.packagesNumber,
        
        // Próximos Passos
        responseTime: data.nextSteps.responseTime,
        concerns: data.nextSteps.concerns,
        wantsMeeting: data.nextSteps.wantsMeeting,
        meetingTime: data.nextSteps.meetingTime,
        howFound: data.nextSteps.howFound,
        additionalNotes: data.nextSteps.additionalNotes,
        
        // Pacotes
        packages: packages,
        
        // Metadados
        validUntil: validUntil,
        status: 'SENT'
      }
    });
    
    // Envie e-mail de notificação (opcional)
    // await sendProposalEmail(proposal);
    
    return NextResponse.json({
      success: true,
      proposalId: proposal.id,
      proposalUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${proposal.id}`
    });
    
  } catch (error) {
    console.error('Erro ao criar proposta:', error);
    return NextResponse.json(
      { error: 'Erro ao criar proposta' }, 
      { status: 500 }
    );
  }
}
```

---

### **PASSO 2: API para Buscar Proposta**

#### **/app/api/proposals/[id]/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: params.id }
    });
    
    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposta não encontrada' },
        { status: 404 }
      );
    }
    
    // Incremente contador de visualizações
    await prisma.proposal.update({
      where: { id: params.id },
      data: {
        viewCount: { increment: 1 },
        lastViewedAt: new Date(),
        status: proposal.status === 'SENT' ? 'VIEWED' : proposal.status
      }
    });
    
    return NextResponse.json(proposal);
    
  } catch (error) {
    console.error('Erro ao buscar proposta:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar proposta' },
      { status: 500 }
    );
  }
}
```

---

### **PASSO 3: Página de Visualização da Proposta**

#### **/app/[id]/page.tsx**

```typescript
import { notFound } from 'next/navigation';
import ProposalViewer from '@/components/ProposalViewer';
import ProposalActions from '@/components/ProposalActions';

interface ProposalPageProps {
  params: {
    id: string;
  };
}

async function getProposal(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/proposals/${id}`,
    { cache: 'no-store' } // Sempre buscar dados atualizados
  );
  
  if (!res.ok) return null;
  return res.json();
}

export default async function ProposalPage({ params }: ProposalPageProps) {
  const proposal = await getProposal(params.id);
  
  if (!proposal) {
    notFound();
  }
  
  // Verifique se está expirada
  const isExpired = new Date(proposal.validUntil) < new Date();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header fixo com ações */}
      <ProposalActions 
        proposalId={proposal.id}
        isExpired={isExpired}
      />
      
      {/* Container da proposta */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <ProposalViewer 
          proposal={proposal}
          isExpired={isExpired}
        />
      </main>
    </div>
  );
}

// SEO
export async function generateMetadata({ params }: ProposalPageProps) {
  const proposal = await getProposal(params.id);
  
  if (!proposal) {
    return {
      title: 'Proposta não encontrada'
    };
  }
  
  return {
    title: `Proposta Comercial - ${proposal.clientCompany}`,
    description: `Proposta comercial personalizada da Skyz Design BR para ${proposal.clientCompany}`,
  };
}
```

---

### **PASSO 4: Componente de Visualização da Proposta**

#### **/components/ProposalViewer.tsx**

```typescript
'use client';

import { Proposal } from '@prisma/client';
import { Calendar, Building2, User, Mail, Phone } from 'lucide-react';
import ProposalSection from './ProposalSection';
import PackageCard from './PackageCard';

interface ProposalViewerProps {
  proposal: Proposal;
  isExpired: boolean;
}

export default function ProposalViewer({ proposal, isExpired }: ProposalViewerProps) {
  const packages = proposal.packages as any[];
  
  return (
    <div className="bg-white shadow-2xl rounded-2xl overflow-hidden print:shadow-none">
      
      {/* CAPA */}
      <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 text-white p-16 text-center">
        {isExpired && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            Proposta Expirada
          </div>
        )}
        
        {/* Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center">
            {/* Adicione logo aqui */}
            <span className="text-blue-600 font-bold text-2xl">SKYZ</span>
          </div>
        </div>
        
        <h1 className="text-5xl font-bold mb-4">PROPOSTA COMERCIAL</h1>
        <div className="text-2xl font-light mb-2">{proposal.clientCompany}</div>
        <div className="text-lg opacity-90">Proposta Nº {proposal.proposalNumber}</div>
        
        <div className="mt-8 flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Emitida em: {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Válida até: {new Date(proposal.validUntil).toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>
      
      {/* CONTEÚDO */}
      <div className="p-12 space-y-12">
        
        {/* 1. APRESENTAÇÃO */}
        <ProposalSection 
          number="01"
          title="Sobre a Skyz Design BR"
          icon={<Building2 className="w-6 h-6" />}
        >
          <p className="text-gray-700 leading-relaxed mb-4">
            A Skyz Design BR é uma empresa especializada em design e desenvolvimento 
            de software que transforma ideias em soluções digitais de alto impacto.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Com expertise em tecnologias modernas e metodologias ágeis, entregamos 
            projetos que impulsionam negócios e criam experiências memoráveis.
          </p>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Missão</h4>
              <p className="text-sm text-gray-700">
                Criar experiências digitais que impulsionam negócios
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Instagram</h4>
              <p className="text-sm text-gray-700">
                @skyzdesignbr
              </p>
            </div>
          </div>
        </ProposalSection>
        
        {/* 2. ENTENDIMENTO DO DESAFIO */}
        <ProposalSection 
          number="02"
          title="Entendimento do Desafio"
          icon={<User className="w-6 h-6" />}
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Contexto Atual</h4>
              <p className="text-gray-700 leading-relaxed">
                Com base em nossa conversa, identificamos que <strong>{proposal.clientCompany}</strong> enfrenta 
                o seguinte desafio: {proposal.mainObstacle}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Histórico do Problema</h4>
              <p className="text-gray-700 leading-relaxed">
                Este problema persiste há <strong>{proposal.problemDuration}</strong>, e sabemos 
                que {proposal.motivation}.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Tentativas Anteriores</h4>
              <p className="text-gray-700 leading-relaxed">
                Já foram tentadas soluções como: {proposal.previousAttempts}
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                No entanto, estas não tiveram o sucesso esperado porque: {proposal.whyFailed}
              </p>
            </div>
            
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              <h4 className="font-semibold text-amber-900 mb-2">⚠️ Impacto se Não Resolvido</h4>
              <p className="text-gray-700 leading-relaxed">
                {proposal.consequences}
              </p>
            </div>
          </div>
        </ProposalSection>
        
        {/* 3. SOLUÇÃO PROPOSTA */}
        <ProposalSection 
          number="03"
          title="Solução Proposta"
          icon={<Mail className="w-6 h-6" />}
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Visão da Solução</h4>
              <p className="text-gray-700 leading-relaxed">
                {proposal.idealSolution}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Objetivos a Alcançar</h4>
              <ul className="space-y-2">
                {(proposal.objectives as string[]).map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-3">🎯 Benefícios Esperados</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Resolução completa dos desafios identificados</li>
                <li>• Impacto direto em: {proposal.beneficiaries}</li>
                <li>• Prazo de implementação: {proposal.timeline}</li>
                {proposal.deadline && (
                  <li>• Data limite respeitada: {proposal.deadline}</li>
                )}
              </ul>
            </div>
          </div>
        </ProposalSection>
        
        {/* 4. ESCOPO E PACOTES */}
        <ProposalSection 
          number="04"
          title="Opções de Investimento"
          icon={<Phone className="w-6 h-6" />}
        >
          <p className="text-gray-700 mb-6">
            Preparamos {packages.length} opções de pacotes para atender suas necessidades:
          </p>
          
          <div className={`grid gap-6 ${packages.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            {packages.map((pkg, idx) => (
              <PackageCard 
                key={idx}
                package={pkg}
                isRecommended={idx === 1} // Pacote do meio recomendado
              />
            ))}
          </div>
          
          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Formas de Pagamento</h4>
            <ul className="space-y-2 text-gray-700">
              <li>• À vista: 10% de desconto via PIX ou transferência</li>
              <li>• Parcelado: Até 12x no cartão de crédito</li>
              <li>• Personalizado: Entrada + parcelas (sob consulta)</li>
            </ul>
          </div>
        </ProposalSection>
        
        {/* 5. CRONOGRAMA */}
        <ProposalSection 
          number="05"
          title="Cronograma de Entrega"
          icon={<Calendar className="w-6 h-6" />}
        >
          {/* Adicione timeline aqui */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Semana 1-2: Kickoff e Planejamento</h4>
                <p className="text-gray-600 text-sm">Alinhamento de requisitos e definição de escopo detalhado</p>
              </div>
            </div>
            {/* Adicione mais etapas */}
          </div>
        </ProposalSection>
        
        {/* Continue com as outras seções... */}
        
        {/* INFORMAÇÕES DO CLIENTE */}
        <div className="border-t pt-8 mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Proposta Elaborada Para:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Nome:</p>
              <p className="font-semibold">{proposal.clientName}</p>
            </div>
            <div>
              <p className="text-gray-600">Cargo:</p>
              <p className="font-semibold">{proposal.clientRole}</p>
            </div>
            <div>
              <p className="text-gray-600">Empresa:</p>
              <p className="font-semibold">{proposal.clientCompany}</p>
            </div>
            <div>
              <p className="text-gray-600">E-mail:</p>
              <p className="font-semibold">{proposal.clientEmail}</p>
            </div>
          </div>
        </div>
        
      </div>
      
      {/* FOOTER */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 text-center">
        <h3 className="text-2xl font-bold mb-2">Vamos Transformar Sua Visão em Realidade Digital!</h3>
        <p className="mb-4">Entre em contato para agendar uma conversa</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <span>📧 contato@skyzdesign.com.br</span>
          <span>📱 WhatsApp: (11) 99999-9999</span>
          <span>📸 @skyzdesignbr</span>
        </div>
      </div>
      
    </div>
  );
}
```

---

### **PASSO 5: Componente de Ações da Proposta**

#### **/components/ProposalActions.tsx**

```typescript
'use client';

import { useState } from 'react';
import { Download, FileText, Link2, Mail, Check } from 'lucide-react';

interface ProposalActionsProps {
  proposalId: string;
  isExpired: boolean;
}

export default function ProposalActions({ proposalId, isExpired }: ProposalActionsProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState<'pdf' | 'docx' | null>(null);
  
  const proposalUrl = `${window.location.origin}/${proposalId}`;
  
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(proposalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = async (format: 'pdf' | 'docx') => {
    setDownloading(format);
    
    try {
      const res = await fetch(`/api/proposals/${proposalId}/${format}`);
      const blob = await res.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `proposta-${proposalId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar:', error);
      alert('Erro ao gerar arquivo. Tente novamente.');
    } finally {
      setDownloading(null);
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="sticky top-0 z-50 bg-white border-b shadow-sm print:hidden">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4 max-w-5xl">
        
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="font-semibold text-gray-900">Skyz Design BR</span>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Copiar Link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Copiado!</span>
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4" />
                <span>Copiar Link</span>
              </>
            )}
          </button>
          
          {/* Baixar PDF */}
          <button
            onClick={() => handleDownload('pdf')}
            disabled={downloading === 'pdf'}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading === 'pdf' ? 'Gerando...' : 'Baixar PDF'}</span>
          </button>
          
          {/* Baixar DOCX */}
          <button
            onClick={() => handleDownload('docx')}
            disabled={downloading === 'docx'}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            <span>{downloading === 'docx' ? 'Gerando...' : 'Baixar DOCX'}</span>
          </button>
          
          {/* Enviar E-mail */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Mail className="w-4 h-4" />
            <span>Enviar</span>
          </button>
          
        </div>
      </div>
    </div>
  );
}
```

---

### **PASSO 6: APIs de Download (Lazy Load)**

#### **/app/api/proposals/[id]/pdf/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateProposalPDF } from '@/lib/generators/generatePDF';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: params.id }
    });
    
    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposta não encontrada' },
        { status: 404 }
      );
    }
    
    // Gere o PDF (apenas quando solicitado)
    const pdfBuffer = await generateProposalPDF(proposal);
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="proposta-${proposal.proposalNumber}.pdf"`
      }
    });
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar PDF' },
      { status: 500 }
    );
  }
}
```

#### **/app/api/proposals/[id]/docx/route.ts**

```typescript
// Similar ao PDF, mas gerando DOCX
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateProposalDOCX } from '@/lib/generators/generateDOCX';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: params.id }
    });
    
    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposta não encontrada' },
        { status: 404 }
      );
    }
    
    const docxBuffer = await generateProposalDOCX(proposal);
    
    return new NextResponse(docxBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="proposta-${proposal.proposalNumber}.docx"`
      }
    });
    
  } catch (error) {
    console.error('Erro ao gerar DOCX:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar DOCX' },
      { status: 500 }
    );
  }
}
```

---

### **PASSO 7: Atualizar Formulário para Redirecionar**

#### **/components/forms/FormContainer.tsx (atualizar submit)**

```typescript
const handleSubmit = async (data: ProposalData) => {
  setIsSubmitting(true);
  
  try {
    const response = await fetch('/api/proposals/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Redirecione para a página da proposta
      router.push(`/${result.proposalId}`);
    } else {
      throw new Error(result.error);
    }
    
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao criar proposta. Tente novamente.');
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## 🎨 DESIGN PARA IMPRESSÃO

Adicione CSS para tornar a página print-friendly:

```css
/* /app/globals.css */

@media print {
  /* Esconda elementos desnecessários */
  .print\\:hidden {
    display: none !important;
  }
  
  /* Remova sombras e bordas arredondadas */
  * {
    box-shadow: none !important;
    border-radius: 0 !important;
  }
  
  /* Otimize cores para impressão */
  body {
    background: white !important;
  }
  
  /* Force quebra de página em seções */
  .print\\:break-before {
    page-break-before: always;
  }
  
  /* Mantenha elementos juntos */
  .print\\:break-inside-avoid {
    page-break-inside: avoid;
  }
  
  /* Tamanho de página */
  @page {
    size: A4;
    margin: 2cm;
  }
}
```

---

## 📊 MELHORIAS ADICIONAIS

### **1. Compartilhamento Social**

Adicione meta tags Open Graph para compartilhamento:

```typescript
// /app/[id]/page.tsx
export async function generateMetadata({ params }: ProposalPageProps) {
  const proposal = await getProposal(params.id);
  
  return {
    title: `Proposta Comercial - ${proposal.clientCompany}`,
    description: `Proposta comercial personalizada da Skyz Design BR`,
    openGraph: {
      title: `Proposta Comercial - ${proposal.clientCompany}`,
      description: 'Proposta comercial personalizada',
      images: ['/og-image.jpg'],
    },
  };
}
```

### **2. Página 404 Personalizada**

```typescript
// /app/[id]/not-found.tsx
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Proposta não encontrada</h1>
        <p className="text-gray-600 mb-8">
          A proposta que você está procurando não existe ou foi removida.
        </p>
        <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
          Criar Nova Proposta
        </a>
      </div>
    </div>
  );
}
```

### **3. Analytics de Visualização**

Track quando o cliente visualiza:

```typescript
// /components/ProposalViewer.tsx
useEffect(() => {
  // Registre visualização
  fetch(`/api/proposals/${proposal.id}/track`, {
    method: 'POST'
  });
}, [proposal.id]);
```

---

## ✅ CHECKLIST DE MIGRAÇÃO

### **Banco de Dados:**
- [ ] Criar schema `Proposal` com todos os campos
- [ ] Executar migração do Prisma
- [ ] Testar criação de proposta

### **Backend:**
- [ ] API `/api/proposals/create` funcionando
- [ ] API `/api/proposals/[id]` retornando dados
- [ ] API `/api/proposals/[id]/pdf` gerando PDF
- [ ] API `/api/proposals/[id]/docx` gerando DOCX
- [ ] Sistema de tracking de visualizações

### **Frontend:**
- [ ] Página `/[id]` renderizando proposta completa
- [ ] Design responsivo funcionando
- [ ] Botões de download funcionando
- [ ] Botão copiar link funcionando
- [ ] CSS de impressão otimizado
- [ ] Loading states em todas as ações

### **Formulário:**
- [ ] Submissão salvando no banco
- [ ] Redirecionamento para `/:id` após criação
- [ ] Validação funcionando

### **Testes:**
- [ ] Criar proposta e visualizar
- [ ] Baixar PDF e verificar qualidade
- [ ] Baixar DOCX e verificar formatação
- [ ] Testar impressão (Ctrl+P)
- [ ] Testar compartilhamento de link
- [ ] Verificar responsividade mobile

---

## 🚀 VANTAGENS DA NOVA ABORDAGEM

✅ **Experiência Imediata:** Cliente vê a proposta instantaneamente  
✅ **URL Compartilhável:** Fácil de enviar e compartilhar  
✅ **Economia de Recursos:** PDF/DOCX só gerados quando solicitados  
✅ **Tracking:** Sabe quando cliente visualizou  
✅ **SEO-Friendly:** Indexável pelo Google  
✅ **Print-Optimized:** Pode imprimir direto do navegador  
✅ **Sempre Acessível:** Cliente pode voltar ao link sempre  
✅ **Atualizável:** Pode corrigir proposta sem gerar novo arquivo  

---

## 🎯 PRIORIDADES DE IMPLEMENTAÇÃO

### **Fase 1 (Essencial):**
1. Schema do banco de dados
2. API de criação de proposta
3. Página de visualização básica
4. Redirecionamento após formulário

### **Fase 2 (Importante):**
5. Design completo da visualização
6. Geração de PDF sob demanda
7. Geração de DOCX sob demanda
8. Botão copiar link

### **Fase 3 (Melhorias):**
9. Sistema de tracking
10. E-mail automático
11. Print optimization
12. Compartilhamento social

---

## 💡 DICAS FINAIS

- **Mantenha o design limpo e profissional** na visualização web
- **Use lazy loading** para imagens pesadas
- **Implemente cache** para propostas frequentemente acessadas
- **Adicione skeleton loading** enquanto carrega os dados
- **Teste em diferentes tamanhos de tela**
- **Valide as quebras de página** na impressão

---

## 📧 E-MAIL DE NOTIFICAÇÃO (OPCIONAL)

Quando a proposta for criada, envie e-mail ao cliente:

```
Assunto: Sua Proposta Comercial Personalizada - Skyz Design BR

Olá {clientName}!

Sua proposta comercial personalizada está pronta! 🎉

Acesse aqui: {proposalUrl}

Na página você poderá:
• Visualizar a proposta completa
• Baixar em PDF ou DOCX
• Compartilhar o link
• Entrar em contato conosco

Validade: {validUntil}

Estamos à disposição!
```

---

**Implementação completa irá transformar a experiência do cliente, tornando muito mais profissional e acessível! 🚀**
