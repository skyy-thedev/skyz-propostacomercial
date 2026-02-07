import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COMPANY_INFO } from "@/lib/config/company-content";
import { getServiceById } from "@/lib/config/services";

// Send notification to Skyz when proposal is first viewed
async function notifyFirstView(proposal: {
  proposalNumber: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string | null;
  mainService: string;
  id: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log(
      `📬 [NOTIFY] Proposta ${proposal.proposalNumber} visualizada por ${proposal.clientName}`
    );
    return;
  }

  const notifyEmail =
    process.env.ADMIN_NOTIFY_EMAIL || COMPANY_INFO.email;
  const service = getServiceById(proposal.mainService);
  const proposalUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://skyz-propostacomercial.vercel.app"}/proposta/${proposal.id}`;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from:
          process.env.EMAIL_FROM || "SKYZ DESIGN <onboarding@resend.dev>",
        to: [notifyEmail],
        subject: `👁️ Proposta ${proposal.proposalNumber} foi visualizada!`,
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;">
            <h2 style="color:#0066FF;">Proposta Visualizada!</h2>
            <p>A proposta <strong>${proposal.proposalNumber}</strong> acabou de ser aberta.</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
              <tr><td style="padding:6px 0;color:#666;">Cliente:</td><td style="padding:6px 0;"><strong>${proposal.clientName}</strong></td></tr>
              ${proposal.clientCompany ? `<tr><td style="padding:6px 0;color:#666;">Empresa:</td><td style="padding:6px 0;">${proposal.clientCompany}</td></tr>` : ""}
              <tr><td style="padding:6px 0;color:#666;">Email:</td><td style="padding:6px 0;">${proposal.clientEmail}</td></tr>
              <tr><td style="padding:6px 0;color:#666;">Serviço:</td><td style="padding:6px 0;">${service?.name || proposal.mainService}</td></tr>
            </table>
            <a href="${proposalUrl}" style="display:inline-block;background:#0066FF;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Ver Proposta</a>
            <p style="margin-top:20px;font-size:12px;color:#999;">Este é um email automático do sistema de propostas Skyz Design.</p>
          </div>
        `,
        text: `Proposta ${proposal.proposalNumber} visualizada por ${proposal.clientName} (${proposal.clientEmail}). Ver: ${proposalUrl}`,
      }),
    });
    console.log(
      `✅ Notificação enviada para ${notifyEmail} - Proposta ${proposal.proposalNumber}`
    );
  } catch (err) {
    console.error("⚠️ Erro ao enviar notificação:", err);
  }
}

export async function POST(
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

    const isFirstView = proposal.status === "SENT";

    // Increment counter and update status
    await prisma.proposal.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
        lastViewedAt: new Date(),
        status: isFirstView ? "VIEWED" : proposal.status,
      },
    });

    // Send notification on first view (async, don't block response)
    if (isFirstView) {
      notifyFirstView(proposal).catch(() => {});
    }

    return NextResponse.json({ success: true, viewCount: proposal.viewCount + 1 });
  } catch (error) {
    console.error("Erro ao registrar visualização:", error);
    return NextResponse.json(
      { error: "Erro ao registrar visualização" },
      { status: 500 }
    );
  }
}
