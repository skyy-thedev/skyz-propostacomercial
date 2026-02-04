import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateProposalNumber, getValidityDate } from "@/lib/utils";
import {
  generateSmartRecommendation,
  RecommendationInput,
} from "@/lib/generators/recommendationEngine";

// Interface para os dados do novo formulário otimizado
interface OptimizedFormData {
  // Step 1 - Serviço
  category: "design" | "web";
  service: string;
  serviceOption?: string;
  timeline: string;

  // Step 2 - Negócio
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientCompany?: string;
  clientSegment?: string;
  challenges?: string[];
  hasBranding?: string;

  // Step 3 - Preferências
  deliveryMethod?: string[];
  wantsMeeting: string;
  observations?: string;

  // V3: Opções de envio automático
  sendProposalByEmail?: boolean;
  sendProposalByWhatsApp?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const data: OptimizedFormData = await request.json();

    // Validações básicas
    if (!data.service || !data.clientName || !data.clientEmail) {
      return NextResponse.json(
        { error: "Dados obrigatórios faltando" },
        { status: 400 }
      );
    }

    // Gera número único da proposta
    const proposalNumber = generateProposalNumber();

    // Gera recomendações inteligentes baseadas nos dados
    const recommendationInput: RecommendationInput = {
      service: data.service,
      serviceOption: data.serviceOption,
      challenges: data.challenges || [],
      timeline: data.timeline,
      hasBranding: data.hasBranding,
    };

    const recommendations = generateSmartRecommendation(recommendationInput);

    // Data de validade (15 dias)
    const validUntil = getValidityDate(15);

    // Salva no banco
    const proposal = await prisma.proposal.create({
      data: {
        proposalNumber,

        // Cliente
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone || null,
        clientCompany: data.clientCompany || null,
        clientSegment: data.clientSegment || null,

        // Serviço
        mainService: data.service,
        category: data.category,
        serviceOption: data.serviceOption || null,
        
        // Contexto
        challenges: JSON.stringify(data.challenges || []),
        timeline: data.timeline,
        hasBranding: data.hasBranding || null,
        deliveryMethod: JSON.stringify(data.deliveryMethod || []),
        wantsMeeting: data.wantsMeeting === "sim",
        observations: data.observations || null,

        // Pacotes gerados pela engine de recomendação
        recommendedPackage: JSON.stringify(recommendations.recommendedPackage),
        alternativePackages: JSON.stringify(recommendations.alternativePackages),
        combos: JSON.stringify(recommendations.combos),

        // V3: Opções de envio automático
        sendByEmail: data.sendProposalByEmail ?? true,
        sendByWhatsApp: data.sendProposalByWhatsApp ?? false,

        // Metadados
        validUntil,
        status: "SENT",
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const proposalUrl = `${baseUrl}/proposta/${proposal.id}`;

    // V3: Disparar email assíncrono se solicitado
    if (data.sendProposalByEmail) {
      // Dispara envio de email em background (não bloqueia resposta)
      fetch(`${baseUrl}/api/proposals/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalId: proposal.id,
          email: data.clientEmail,
          name: data.clientName,
          proposalUrl,
          proposalNumber: proposal.proposalNumber,
        }),
      }).catch((err) => console.error("Erro ao disparar email:", err));
    }

    return NextResponse.json({
      success: true,
      proposalId: proposal.id,
      proposalNumber: proposal.proposalNumber,
      proposalUrl,
      emailSent: data.sendProposalByEmail ?? true,
    });
  } catch (error) {
    console.error("Erro ao criar proposta:", error);
    return NextResponse.json(
      { error: "Erro ao criar proposta", details: String(error) },
      { status: 500 }
    );
  }
}
