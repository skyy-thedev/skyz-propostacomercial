import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServiceById } from "@/lib/config/services";

// Temporariamente simplificado para V2 - gera texto simples formatado
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const proposal = await prisma.proposal.findUnique({
      where: { id },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposta não encontrada" },
        { status: 404 }
      );
    }

    const service = getServiceById(proposal.mainService);
    const recommendedPackage = proposal.recommendedPackage 
      ? JSON.parse(proposal.recommendedPackage)
      : null;

    // Por enquanto, retornar uma versão texto da proposta
    // TODO: Implementar geração de DOCX para V2
    const proposalText = `
PROPOSTA COMERCIAL Nº ${proposal.proposalNumber}
===============================================

CLIENTE
-------
Nome: ${proposal.clientName}
Email: ${proposal.clientEmail}
${proposal.clientPhone ? `Telefone: ${proposal.clientPhone}` : ""}
${proposal.clientCompany ? `Empresa: ${proposal.clientCompany}` : ""}
${proposal.clientSegment ? `Segmento: ${proposal.clientSegment}` : ""}

SERVIÇO SOLICITADO
------------------
Categoria: ${proposal.category === "design" ? "Design & Social Media" : "Desenvolvimento Web"}
Serviço: ${service?.name || proposal.mainService}
Prazo: ${proposal.timeline}

${recommendedPackage ? `
PACOTE RECOMENDADO
------------------
${recommendedPackage.name}
Preço: R$ ${recommendedPackage.price?.toFixed(2).replace(".", ",")}
${recommendedPackage.description || ""}

Inclui:
${recommendedPackage.includes?.map((i: string) => `- ${i}`).join("\n") || ""}

Benefícios:
${recommendedPackage.benefits?.map((b: string) => `- ${b}`).join("\n") || ""}
` : ""}

---
Proposta válida até: ${new Date(proposal.validUntil).toLocaleDateString("pt-BR")}
Skyz Design BR - @skyzdesignbr
    `.trim();

    // Retornar como arquivo de texto por enquanto
    return new NextResponse(proposalText, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="proposta-${proposal.proposalNumber}.txt"`,
      },
    });
  } catch (error) {
    console.error("Erro ao gerar documento:", error);
    return NextResponse.json({ error: "Erro ao gerar documento" }, { status: 500 });
  }
}
