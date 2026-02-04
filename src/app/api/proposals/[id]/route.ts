import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const proposal = await prisma.proposal.findUnique({
      where: { id },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposta não encontrada" },
        { status: 404 }
      );
    }

    // Incremente contador de visualizações
    await prisma.proposal.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
        lastViewedAt: new Date(),
        status: proposal.status === "SENT" ? "VIEWED" : proposal.status,
      },
    });

    // Parse JSON fields do novo schema
    const parsedProposal = {
      ...proposal,
      challenges: proposal.challenges ? JSON.parse(proposal.challenges) : [],
      deliveryMethod: proposal.deliveryMethod ? JSON.parse(proposal.deliveryMethod) : [],
      recommendedPackage: proposal.recommendedPackage ? JSON.parse(proposal.recommendedPackage) : null,
      alternativePackages: proposal.alternativePackages ? JSON.parse(proposal.alternativePackages) : [],
      combos: proposal.combos ? JSON.parse(proposal.combos) : [],
      createdAt: proposal.createdAt.toISOString(),
      updatedAt: proposal.updatedAt.toISOString(),
      validUntil: proposal.validUntil.toISOString(),
      lastViewedAt: proposal.lastViewedAt?.toISOString() || null,
    };

    return NextResponse.json({ proposal: parsedProposal });
  } catch (error) {
    console.error("Erro ao buscar proposta:", error);
    return NextResponse.json(
      { error: "Erro ao buscar proposta" },
      { status: 500 }
    );
  }
}

// Atualizar status da proposta
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Apenas atualiza o status - selectedPackage pode ser registrado
    // em observations ou como metadata futuramente
    const proposal = await prisma.proposal.update({
      where: { id },
      data: {
        status: body.status,
        // Se um pacote foi selecionado, armazenar nas observations
        ...(body.selectedPackage && {
          observations: `Pacote selecionado: ${body.selectedPackage}`,
        }),
      },
    });

    return NextResponse.json(proposal);
  } catch (error) {
    console.error("Erro ao atualizar proposta:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar proposta" },
      { status: 500 }
    );
  }
}
