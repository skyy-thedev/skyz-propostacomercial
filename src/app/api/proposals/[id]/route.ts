import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COMPANY_INFO } from "@/lib/config/company-content";
import { getServiceById } from "@/lib/config/services";

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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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

    // Send notification on acceptance
    if (body.status === "ACCEPTED" && process.env.RESEND_API_KEY) {
      const notifyEmail = process.env.ADMIN_NOTIFY_EMAIL || COMPANY_INFO.email;
      const service = getServiceById(proposal.mainService);
      const proposalUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://skyz-propostacomercial.vercel.app"}/proposta/${proposal.id}`;

      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "SKYZ DESIGN <onboarding@resend.dev>",
          to: [notifyEmail],
          subject: `🎉 Proposta ${proposal.proposalNumber} foi ACEITA!`,
          html: `
            <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;">
              <h2 style="color:#10B981;">Proposta Aceita! 🎉</h2>
              <p>A proposta <strong>${proposal.proposalNumber}</strong> foi aceita!</p>
              <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                <tr><td style="padding:6px 0;color:#666;">Cliente:</td><td style="padding:6px 0;"><strong>${proposal.clientName}</strong></td></tr>
                ${proposal.clientCompany ? `<tr><td style="padding:6px 0;color:#666;">Empresa:</td><td style="padding:6px 0;">${proposal.clientCompany}</td></tr>` : ""}
                <tr><td style="padding:6px 0;color:#666;">Serviço:</td><td style="padding:6px 0;">${service?.name || proposal.mainService}</td></tr>
                ${body.selectedPackage ? `<tr><td style="padding:6px 0;color:#666;">Pacote:</td><td style="padding:6px 0;"><strong>${body.selectedPackage}</strong></td></tr>` : ""}
              </table>
              <a href="${proposalUrl}" style="display:inline-block;background:#10B981;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Ver Proposta</a>
            </div>
          `,
          text: `Proposta ${proposal.proposalNumber} ACEITA por ${proposal.clientName}! Ver: ${proposalUrl}`,
        }),
      }).catch((err) => console.error("⚠️ Erro ao notificar aceite:", err));
    }

    return NextResponse.json(proposal);
  } catch (error) {
    console.error("Erro ao atualizar proposta:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar proposta" },
      { status: 500 }
    );
  }
}
