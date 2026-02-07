// ============================================
// GERADOR DE PDF - V4
// Compatível com schema V2/V3 do Prisma
// Usa jspdf + jspdf-autotable
// ============================================

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getServiceById } from "@/lib/config/services";
import {
  COMPANY_INFO,
  COMPANY_DIFFERENTIALS,
  TERMS_AND_CONDITIONS,
} from "@/lib/config/company-content";
import { formatCurrency } from "@/lib/utils";

// Cores da identidade visual
const COLORS = {
  primary: [0, 102, 255] as [number, number, number],
  secondary: [99, 102, 241] as [number, number, number],
  accent: [139, 92, 246] as [number, number, number],
  dark: [30, 41, 59] as [number, number, number],
  darkLight: [71, 85, 105] as [number, number, number],
  gray: [148, 163, 184] as [number, number, number],
  light: [248, 250, 252] as [number, number, number],
  success: [16, 185, 129] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

const TIMELINE_LABELS: Record<string, string> = {
  urgente: "Entrega Urgente (ate 3 dias)",
  normal: "Prazo Normal (1-2 semanas)",
  flexivel: "Prazo Flexivel",
};

const CHALLENGE_LABELS: Record<string, string> = {
  visibility: "Aumentar visibilidade online",
  sales: "Gerar mais vendas",
  branding: "Fortalecer a marca",
  engagement: "Aumentar engajamento",
  presence: "Criar presenca digital",
  conversion: "Melhorar conversao",
};

// Interface for DB proposal data
export interface ProposalForPDF {
  id: string;
  proposalNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  clientCompany?: string | null;
  clientSegment?: string | null;
  category: string;
  mainService: string;
  serviceOption?: string | null;
  challenges: string;
  timeline: string;
  hasBranding?: string | null;
  deliveryMethod: string;
  wantsMeeting: boolean;
  observations?: string | null;
  recommendedPackage?: string | null;
  alternativePackages: string;
  combos?: string | null;
  status: string;
  createdAt: Date;
  validUntil: Date;
  viewCount: number;
}

interface PackageData {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  includes: string[];
  benefits: string[];
  deliveryTime: string;
  isRecommended?: boolean;
  tag?: string;
}

function fmtDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function fmtShortDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

// ============================================
// MAIN EXPORT - Generates PDF from V3 Proposal
// Returns: Buffer (Node.js) for API routes
// ============================================
export function generateProposalPDFBuffer(proposal: ProposalForPDF): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  // Parse JSON data
  const service = getServiceById(proposal.mainService);
  const recommendedPkg: PackageData | null = proposal.recommendedPackage
    ? JSON.parse(proposal.recommendedPackage)
    : null;
  const alternativePkgs: PackageData[] = proposal.alternativePackages
    ? JSON.parse(proposal.alternativePackages)
    : [];
  const combos: PackageData[] = proposal.combos
    ? JSON.parse(proposal.combos)
    : [];
  const challenges: string[] = proposal.challenges
    ? JSON.parse(proposal.challenges)
    : [];

  // Helper: check new page
  const checkNewPage = (requiredSpace: number) => {
    if (y + requiredSpace > pageHeight - 25) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  };

  // Helper: draw section header with accent bar
  const drawSectionHeader = (title: string) => {
    doc.setFillColor(...COLORS.primary);
    doc.rect(margin, y, 4, 8, "F");
    doc.setTextColor(...COLORS.dark);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin + 8, y + 6);
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 10, margin + contentWidth, y + 10);
    y += 14;
  };

  // ============================================
  // PAGE 1: COVER
  // ============================================

  // Header gradient background
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 100, "F");
  // Secondary overlay for gradient effect
  for (let i = 0; i < 20; i++) {
    const alpha = i / 20;
    doc.setFillColor(
      Math.round(COLORS.primary[0] + (COLORS.secondary[0] - COLORS.primary[0]) * alpha),
      Math.round(COLORS.primary[1] + (COLORS.secondary[1] - COLORS.primary[1]) * alpha),
      Math.round(COLORS.primary[2] + (COLORS.secondary[2] - COLORS.primary[2]) * alpha)
    );
    doc.rect(pageWidth * (i / 20), 0, pageWidth / 20, 100, "F");
  }

  // Logo circle
  doc.setFillColor(...COLORS.white);
  doc.circle(pageWidth / 2, 28, 12, "F");
  doc.setTextColor(...COLORS.primary);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("SKYZ", pageWidth / 2, 31, { align: "center" });

  // Title
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("PROPOSTA COMERCIAL", pageWidth / 2, 58, { align: "center" });

  // Proposal number
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("N. " + proposal.proposalNumber, pageWidth / 2, 68, { align: "center" });

  // Client name
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const clientLine = proposal.clientCompany
    ? `${proposal.clientName} - ${proposal.clientCompany}`
    : proposal.clientName;
  const clientLines = doc.splitTextToSize(clientLine, contentWidth - 20);
  doc.text(clientLines, pageWidth / 2, 83, { align: "center" });

  // Date badges
  y = 112;
  const halfW = (contentWidth - 10) / 2;
  doc.setFillColor(...COLORS.light);
  doc.roundedRect(margin, y, halfW, 18, 3, 3, "F");
  doc.roundedRect(margin + halfW + 10, y, halfW, 18, 3, 3, "F");

  doc.setTextColor(...COLORS.gray);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Data de Criacao", margin + halfW / 2, y + 6, { align: "center" });
  doc.text("Valida Ate", margin + halfW + 10 + halfW / 2, y + 6, { align: "center" });

  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(fmtDate(proposal.createdAt), margin + halfW / 2, y + 14, { align: "center" });
  doc.text(fmtDate(proposal.validUntil), margin + halfW + 10 + halfW / 2, y + 14, { align: "center" });

  // ============================================
  // CLIENT INFO SECTION
  // ============================================
  y = 142;
  drawSectionHeader("DADOS DO CLIENTE");
  y += 2;

  const clientData: string[][] = [
    ["Nome", proposal.clientName],
    ["E-mail", proposal.clientEmail],
  ];
  if (proposal.clientPhone) clientData.push(["Telefone", proposal.clientPhone]);
  if (proposal.clientCompany) clientData.push(["Empresa", proposal.clientCompany]);
  if (proposal.clientSegment) clientData.push(["Segmento", proposal.clientSegment]);

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [],
    body: clientData,
    theme: "plain",
    styles: {
      fontSize: 10,
      cellPadding: { top: 3, bottom: 3, left: 5, right: 5 },
      textColor: COLORS.dark,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 35, textColor: COLORS.darkLight },
      1: { cellWidth: contentWidth - 35 },
    },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // ============================================
  // SERVICE REQUESTED
  // ============================================
  drawSectionHeader("SERVICO SOLICITADO");
  y += 2;

  const serviceData: string[][] = [
    ["Servico", service?.name || proposal.mainService],
    ["Categoria", proposal.category === "design" ? "Design & Social Media" : "Desenvolvimento Web"],
    ["Prazo", TIMELINE_LABELS[proposal.timeline] || proposal.timeline],
  ];

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [],
    body: serviceData,
    theme: "plain",
    styles: {
      fontSize: 10,
      cellPadding: { top: 3, bottom: 3, left: 5, right: 5 },
      textColor: COLORS.dark,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 35, textColor: COLORS.darkLight },
      1: { cellWidth: contentWidth - 35 },
    },
  });
  y = (doc as any).lastAutoTable.finalY + 5;

  // Challenges
  if (challenges.length > 0) {
    const challengeText = challenges.map((c) => CHALLENGE_LABELS[c] || c).join("  |  ");
    doc.setTextColor(...COLORS.darkLight);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Objetivos:", margin + 5, y + 4);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.dark);
    const cLines = doc.splitTextToSize(challengeText, contentWidth - 35);
    doc.text(cLines, margin + 30, y + 4);
    y += 5 + cLines.length * 4;
  }
  y += 10;

  // ============================================
  // PAGE 2+: RECOMMENDED PACKAGE
  // ============================================
  if (recommendedPkg) {
    checkNewPage(90);
    drawSectionHeader("PACOTE RECOMENDADO");
    y += 3;

    // Highlighted box
    doc.setFillColor(240, 245, 255);
    doc.setDrawColor(...COLORS.primary);
    doc.setLineWidth(0.5);
    const boxStartY = y;

    // Recommended badge
    doc.setFillColor(...COLORS.secondary);
    doc.roundedRect(margin + 5, y + 3, 30, 6, 2, 2, "F");
    doc.setTextColor(...COLORS.white);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("RECOMENDADO", margin + 20, y + 7.3, { align: "center" });
    y += 13;

    // Package name
    doc.setTextColor(...COLORS.dark);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const pkgNameLines = doc.splitTextToSize(recommendedPkg.name, contentWidth - 65);
    doc.text(pkgNameLines, margin + 5, y);

    // Price
    const priceText = formatCurrency(recommendedPkg.price);
    doc.setTextColor(...COLORS.primary);
    doc.setFontSize(18);
    doc.text(priceText, margin + contentWidth - 5, y, { align: "right" });
    y += pkgNameLines.length * 6 + 2;

    // Description
    if (recommendedPkg.description) {
      doc.setTextColor(...COLORS.darkLight);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(recommendedPkg.description, margin + 5, y);
      y += 5;
    }

    // Delivery time
    doc.setTextColor(...COLORS.gray);
    doc.setFontSize(8);
    doc.text("Prazo: " + recommendedPkg.deliveryTime, margin + 5, y);
    y += 7;

    // Includes
    if (recommendedPkg.includes && recommendedPkg.includes.length > 0) {
      doc.setTextColor(...COLORS.dark);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("O que esta incluso:", margin + 5, y);
      y += 5;

      recommendedPkg.includes.forEach((item) => {
        checkNewPage(8);
        doc.setTextColor(...COLORS.success);
        doc.setFontSize(9);
        doc.text("*", margin + 8, y + 1);
        doc.setTextColor(...COLORS.dark);
        doc.setFont("helvetica", "normal");
        const itemLines = doc.splitTextToSize(item, contentWidth - 20);
        doc.text(itemLines, margin + 13, y + 1);
        y += 4 * itemLines.length + 1;
      });
      y += 3;
    }

    // Benefits
    if (recommendedPkg.benefits && recommendedPkg.benefits.length > 0) {
      checkNewPage(25);
      doc.setTextColor(...COLORS.dark);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Beneficios:", margin + 5, y);
      y += 5;

      recommendedPkg.benefits.forEach((benefit) => {
        checkNewPage(8);
        doc.setTextColor(...COLORS.accent);
        doc.setFontSize(9);
        doc.text("+", margin + 8, y + 1);
        doc.setTextColor(...COLORS.dark);
        doc.setFont("helvetica", "normal");
        const bLines = doc.splitTextToSize(benefit, contentWidth - 20);
        doc.text(bLines, margin + 13, y + 1);
        y += 4 * bLines.length + 1;
      });
    }

    // Draw box around recommended package
    const boxH = y - boxStartY + 5;
    doc.setDrawColor(...COLORS.primary);
    doc.setLineWidth(0.5);
    doc.setFillColor(240, 245, 255);
    // Can't fill behind already-drawn content easily, but the outline helps
    doc.roundedRect(margin, boxStartY, contentWidth, boxH, 3, 3, "S");
    y += 10;
  }

  // ============================================
  // ALTERNATIVE PACKAGES
  // ============================================
  if (alternativePkgs.length > 0) {
    checkNewPage(50);
    drawSectionHeader("OUTRAS OPCOES");
    y += 3;

    const altData = alternativePkgs.map((pkg) => [
      pkg.name,
      pkg.tag || "",
      formatCurrency(pkg.price),
      pkg.deliveryTime,
    ]);

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Pacote", "Tipo", "Investimento", "Prazo"]],
      body: altData,
      theme: "striped",
      headStyles: {
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontSize: 9,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        cellPadding: { top: 4, bottom: 4, left: 5, right: 5 },
        textColor: COLORS.dark,
      },
      columnStyles: {
        0: { cellWidth: 55 },
        2: { fontStyle: "bold", textColor: COLORS.primary },
      },
    });
    y = (doc as any).lastAutoTable.finalY + 10;
  }

  // ============================================
  // COMBOS
  // ============================================
  if (combos.length > 0) {
    checkNewPage(50);
    drawSectionHeader("COMBOS ESPECIAIS");
    y += 3;

    combos.forEach((combo) => {
      checkNewPage(35);

      doc.setFillColor(...COLORS.light);
      doc.roundedRect(margin, y, contentWidth, 30, 3, 3, "F");

      // Tag
      if (combo.tag) {
        doc.setFillColor(...COLORS.accent);
        doc.roundedRect(margin + 5, y + 3, 40, 5, 2, 2, "F");
        doc.setTextColor(...COLORS.white);
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.text(combo.tag, margin + 25, y + 6.5, { align: "center" });
      }

      // Name
      doc.setTextColor(...COLORS.dark);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(combo.name, margin + 5, y + 15);

      // Description
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...COLORS.darkLight);
      const descLines = doc.splitTextToSize(combo.description, contentWidth * 0.55);
      doc.text(descLines[0], margin + 5, y + 22);

      // Price
      doc.setTextColor(...COLORS.primary);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(formatCurrency(combo.price), margin + contentWidth - 5, y + 14, { align: "right" });

      // Original + discount
      if (combo.originalPrice && combo.discount) {
        doc.setTextColor(...COLORS.gray);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        const opText = formatCurrency(combo.originalPrice);
        doc.text(opText, margin + contentWidth - 5, y + 20, { align: "right" });
        const opW = doc.getTextWidth(opText);
        doc.setDrawColor(...COLORS.gray);
        doc.setLineWidth(0.3);
        doc.line(margin + contentWidth - 5 - opW, y + 19, margin + contentWidth - 5, y + 19);

        doc.setFillColor(...COLORS.success);
        doc.roundedRect(margin + contentWidth - 25, y + 22, 20, 5, 2, 2, "F");
        doc.setTextColor(...COLORS.white);
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.text(`-${combo.discount}%`, margin + contentWidth - 15, y + 25.5, { align: "center" });
      }

      y += 35;
    });
    y += 5;
  }

  // ============================================
  // NEXT STEPS
  // ============================================
  checkNewPage(80);
  drawSectionHeader("PROXIMOS PASSOS");
  y += 3;

  const steps = [
    { num: "1", text: "Analise os pacotes apresentados nesta proposta" },
    { num: "2", text: "Escolha o pacote que melhor atende suas necessidades" },
    { num: "3", text: "Entre em contato conosco via WhatsApp ou e-mail" },
    { num: "4", text: "Agendaremos uma reuniao para alinhar detalhes" },
    { num: "5", text: "Iniciamos o projeto imediatamente apos aprovacao" },
  ];

  steps.forEach((step) => {
    checkNewPage(12);
    doc.setFillColor(...COLORS.primary);
    doc.circle(margin + 7, y + 3, 4, "F");
    doc.setTextColor(...COLORS.white);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(step.num, margin + 7, y + 5, { align: "center" });

    doc.setTextColor(...COLORS.dark);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(step.text, margin + 15, y + 5);
    y += 11;
  });
  y += 5;

  // ============================================
  // DIFFERENTIALS
  // ============================================
  checkNewPage(70);
  drawSectionHeader("DIFERENCIAIS SKYZ DESIGN");
  y += 3;

  COMPANY_DIFFERENTIALS.slice(0, 6).forEach((diff) => {
    checkNewPage(12);
    doc.setFillColor(...COLORS.light);
    doc.roundedRect(margin, y, contentWidth, 10, 2, 2, "F");
    doc.setTextColor(...COLORS.success);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("*", margin + 5, y + 7);
    doc.setTextColor(...COLORS.dark);
    doc.text(diff.title, margin + 10, y + 7);
    y += 13;
  });
  y += 5;

  // ============================================
  // TERMS & CONDITIONS
  // ============================================
  checkNewPage(60);
  drawSectionHeader("TERMOS E CONDICOES");
  y += 3;

  TERMS_AND_CONDITIONS.slice(0, 4).forEach((term) => {
    checkNewPage(15);
    doc.setTextColor(...COLORS.dark);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("- " + term.title, margin + 2, y);
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.darkLight);
    doc.setFontSize(8);
    const tLines = doc.splitTextToSize(term.content, contentWidth - 10);
    doc.text(tLines, margin + 5, y);
    y += tLines.length * 3.5 + 5;
  });
  y += 5;

  // ============================================
  // CONTACT CTA
  // ============================================
  checkNewPage(45);
  doc.setFillColor(...COLORS.primary);
  doc.roundedRect(margin, y, contentWidth, 35, 3, 3, "F");
  // Gradient overlay
  doc.setFillColor(...COLORS.secondary);
  doc.roundedRect(margin + contentWidth * 0.5, y, contentWidth * 0.5, 35, 0, 3, "F");

  doc.setTextColor(...COLORS.white);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Vamos comecar?", margin + contentWidth / 2, y + 10, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `WhatsApp: ${COMPANY_INFO.phone}  |  E-mail: ${COMPANY_INFO.email}`,
    margin + contentWidth / 2, y + 18, { align: "center" }
  );
  doc.text(
    `Instagram: ${COMPANY_INFO.instagram}  |  ${COMPANY_INFO.website}`,
    margin + contentWidth / 2, y + 25, { align: "center" }
  );

  // ============================================
  // FOOTERS ON ALL PAGES
  // ============================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Header bar on pages 2+
    if (i > 1) {
      doc.setFillColor(...COLORS.primary);
      doc.rect(0, 0, pageWidth, 5, "F");
      doc.setFillColor(...COLORS.secondary);
      doc.rect(pageWidth / 2, 0, pageWidth / 2, 5, "F");
    }

    // Footer
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    doc.setTextColor(...COLORS.gray);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${COMPANY_INFO.name} - ${COMPANY_INFO.email} - ${COMPANY_INFO.phone}`,
      margin, pageHeight - 10
    );
    doc.text(
      `Proposta ${proposal.proposalNumber} - Valida ate ${fmtShortDate(proposal.validUntil)} - Pagina ${i}/${totalPages}`,
      pageWidth - margin, pageHeight - 10, { align: "right" }
    );
  }

  // Return as Buffer for Node.js API routes
  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
