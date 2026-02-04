// ============================================
// TEMPLATE DE EMAIL PARA PROPOSTA COMERCIAL - V3
// ============================================

interface ProposalEmailData {
  clientName: string;
  proposalNumber: string;
  proposalUrl: string;
  serviceName: string;
  companyName?: string;
  validUntil: Date;
}

export function generateProposalEmailHTML(data: ProposalEmailData): string {
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(data.validUntil);

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sua Proposta Comercial - SKYZ DESIGN</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
                ✨ Sua Proposta Está Pronta!
              </h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px;">
                Proposta ${data.proposalNumber}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Olá, <strong>${data.clientName}</strong>! 👋
              </p>
              
              <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0 0 25px;">
                Preparamos uma proposta comercial personalizada para você${data.companyName ? ` e a ${data.companyName}` : ""}.
                Nossa equipe analisou suas necessidades e criou uma solução sob medida.
              </p>

              <!-- Service Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                <tr>
                  <td style="background: linear-gradient(135deg, #f0f9ff 0%, #f5f3ff 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #0ea5e9;">
                    <p style="color: #64748b; font-size: 13px; margin: 0 0 5px; text-transform: uppercase; letter-spacing: 0.5px;">
                      Serviço Solicitado
                    </p>
                    <p style="color: #1e293b; font-size: 18px; font-weight: 600; margin: 0;">
                      ${data.serviceName}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr>
                  <td align="center" style="padding: 10px 0;">
                    <a href="${data.proposalUrl}" 
                       style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4);">
                      📄 Ver Proposta Completa
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Validity Notice -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="background-color: #fef3c7; padding: 15px 20px; border-radius: 8px; text-align: center;">
                    <p style="color: #92400e; font-size: 14px; margin: 0;">
                      ⏰ <strong>Válida até ${formattedDate}</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0;">
                Caso tenha dúvidas, estamos à disposição para agendar uma conversa.
                É só responder este email ou clicar no botão de WhatsApp na proposta.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #1e293b; font-size: 18px; font-weight: 700; margin: 0 0 5px;">
                SKYZ DESIGN
              </p>
              <p style="color: #64748b; font-size: 13px; margin: 0 0 15px;">
                Design & Desenvolvimento Web
              </p>
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                Este email foi enviado automaticamente.<br>
                © ${new Date().getFullYear()} SKYZ DESIGN. Todos os direitos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export function generateProposalEmailText(data: ProposalEmailData): string {
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(data.validUntil);

  return `
Olá, ${data.clientName}! 👋

Sua Proposta Comercial está pronta!
Proposta: ${data.proposalNumber}

${data.companyName ? `Preparamos uma proposta personalizada para você e a ${data.companyName}.` : "Preparamos uma proposta personalizada para você."}

📋 Serviço Solicitado: ${data.serviceName}

🔗 Acesse sua proposta completa:
${data.proposalUrl}

⏰ Válida até: ${formattedDate}

Caso tenha dúvidas, estamos à disposição para agendar uma conversa.
É só responder este email.

---
SKYZ DESIGN
Design & Desenvolvimento Web
© ${new Date().getFullYear()} SKYZ DESIGN. Todos os direitos reservados.
`;
}
