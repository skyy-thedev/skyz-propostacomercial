import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServiceById } from "@/lib/config/services";
import {
  generateProposalEmailHTML,
  generateProposalEmailText,
} from "@/lib/email/proposalEmailTemplate";

// ============================================
// API DE ENVIO DE EMAIL - V3
// ============================================
// 
// COMO ATIVAR ENVIO DE EMAIL EM PRODUÇÃO:
// 
// 1. RESEND (Recomendado - gratuito até 3000 emails/mês):
//    - Instale: npm install resend
//    - Crie conta em: https://resend.com
//    - Configure no .env: RESEND_API_KEY=re_xxxxxxxxxx
//    - Configure no .env: EMAIL_FROM=SKYZ DESIGN <noreply@seudominio.com>
//
// 2. SENDGRID:
//    - Instale: npm install @sendgrid/mail
//    - Configure no .env: SENDGRID_API_KEY=SG.xxxxxxxxxx
//    - Configure no .env: EMAIL_FROM=noreply@seudominio.com
//
// Enquanto não configurado, emails são apenas logados no console.
// ============================================

interface SendEmailRequest {
  proposalId: string;
  email: string;
  name: string;
  proposalUrl: string;
  proposalNumber: string;
}

// Função para enviar via Resend (opcional)
async function sendViaResend(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "SKYZ DESIGN <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao enviar email via Resend");
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: SendEmailRequest = await request.json();

    // Buscar dados da proposta
    const proposal = await prisma.proposal.findUnique({
      where: { id: data.proposalId },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposta não encontrada" },
        { status: 404 }
      );
    }

    // Buscar nome do serviço
    const service = getServiceById(proposal.mainService);
    const serviceName = service?.name || "Serviço personalizado";

    // Gerar conteúdo do email
    const emailData = {
      clientName: data.name,
      proposalNumber: data.proposalNumber,
      proposalUrl: data.proposalUrl,
      serviceName,
      companyName: proposal.clientCompany || undefined,
      validUntil: proposal.validUntil,
    };

    const htmlContent = generateProposalEmailHTML(emailData);
    const textContent = generateProposalEmailText(emailData);
    const subject = `✨ Sua Proposta ${data.proposalNumber} está pronta!`;
    
    let emailSent = false;
    let emailError: string | null = null;

    // Verificar se há configuração de email
    if (process.env.RESEND_API_KEY) {
      // Enviar via Resend API
      const result = await sendViaResend(data.email, subject, htmlContent, textContent);
      emailSent = result.success;
      emailError = result.error || null;
      
      if (emailSent) {
        console.log(`✅ Email enviado via Resend para ${data.email}`);
      } else {
        console.error(`❌ Erro Resend: ${emailError}`);
      }
    } else {
      // Modo desenvolvimento - apenas loga no console
      console.log("==================================================");
      console.log("📧 SIMULAÇÃO DE EMAIL");
      console.log("==================================================");
      console.log(`Para: ${data.email}`);
      console.log(`Assunto: ${subject}`);
      console.log(`Link: ${data.proposalUrl}`);
      console.log("--------------------------------------------------");
      console.log("⚠️  Para ativar envio real, configure RESEND_API_KEY no .env");
      console.log("==================================================");
      
      // Em dev, consideramos como "enviado" para não bloquear o fluxo
      emailSent = true;
      emailError = "DEV_MODE: Email logado no console";
    }

    // Atualizar proposta com data de envio
    if (emailSent) {
      await prisma.proposal.update({
        where: { id: data.proposalId },
        data: {
          emailSentAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: emailSent,
      message: emailSent
        ? "Email enviado com sucesso"
        : "Falha ao enviar email",
      error: emailError,
      devMode: !process.env.RESEND_API_KEY,
    });
  } catch (error) {
    console.error("Erro no endpoint de envio de email:", error);
    return NextResponse.json(
      { error: "Erro ao processar envio de email", details: String(error) },
      { status: 500 }
    );
  }
}
