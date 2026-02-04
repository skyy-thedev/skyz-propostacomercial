import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ProposalData } from "@/types/proposal.types";
import {
  COMPANY_INFO,
  COMPANY_ABOUT,
  COMPANY_DIFFERENTIALS,
  TECHNOLOGIES,
  TESTIMONIALS,
  TERMS_AND_CONDITIONS,
  PROPOSAL_VALIDITY_DAYS,
} from "@/lib/config/company-content";
import {
  formatCurrency,
  formatDate,
  getValidityDate,
  getOptionLabel,
} from "@/lib/utils";
import {
  PROBLEM_DURATION_OPTIONS,
  BENEFICIARIES_OPTIONS,
  TIMELINE_OPTIONS,
  BUDGET_OPTIONS,
  DECISION_MAKER_OPTIONS,
  OBJECTIVES_OPTIONS,
} from "@/types/proposal.types";
import { generatePackages, calculateTimeline } from "./packageGenerator";

// Cores da identidade visual
const COLORS = {
  primary: [0, 102, 255] as [number, number, number],
  secondary: [99, 102, 241] as [number, number, number],
  dark: [30, 41, 59] as [number, number, number],
  darkLight: [71, 85, 105] as [number, number, number],
  light: [248, 250, 252] as [number, number, number],
  success: [16, 185, 129] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

export async function generateProposalPDF(data: ProposalData): Promise<Blob> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = margin;

  // Gerar pacotes baseados nos dados
  const { packages, recommended } = generatePackages(
    data.commercial.budget,
    data.commercial.packagesNumber,
    data.solution.objectives
  );

  // Função auxiliar para adicionar nova página
  const addNewPage = () => {
    doc.addPage();
    yPosition = margin;
    addHeader();
    addFooter();
  };

  // Verificar se precisa de nova página
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 30) {
      addNewPage();
      return true;
    }
    return false;
  };

  // Header em todas as páginas
  const addHeader = () => {
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, pageWidth, 8, "F");
    
    // Gradient effect
    doc.setFillColor(...COLORS.secondary);
    doc.rect(pageWidth / 2, 0, pageWidth / 2, 8, "F");
  };

  // Footer em todas as páginas
  const addFooter = () => {
    const footerY = pageHeight - 15;
    doc.setFillColor(...COLORS.light);
    doc.rect(0, footerY, pageWidth, 15, "F");
    
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.darkLight);
    doc.text(
      `${COMPANY_INFO.name} | ${COMPANY_INFO.instagram}`,
      margin,
      footerY + 8
    );
    
    doc.text(
      `Página ${doc.getNumberOfPages()}`,
      pageWidth - margin,
      footerY + 8,
      { align: "right" }
    );
  };

  // ============================================
  // CAPA
  // ============================================
  
  // Background gradient
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, pageHeight / 2, "F");
  
  // Gradient overlay
  for (let i = 0; i < 50; i++) {
    const alpha = i / 50;
    doc.setFillColor(
      Math.round(COLORS.primary[0] + (COLORS.secondary[0] - COLORS.primary[0]) * alpha),
      Math.round(COLORS.primary[1] + (COLORS.secondary[1] - COLORS.primary[1]) * alpha),
      Math.round(COLORS.primary[2] + (COLORS.secondary[2] - COLORS.primary[2]) * alpha)
    );
    doc.rect(0, (pageHeight / 2 / 50) * i, pageWidth, pageHeight / 2 / 50, "F");
  }
  
  // Logo placeholder (texto)
  doc.setFontSize(32);
  doc.setTextColor(...COLORS.white);
  doc.setFont("helvetica", "bold");
  doc.text(COMPANY_INFO.name.toUpperCase(), pageWidth / 2, 60, { align: "center" });
  
  // Subtítulo
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Design & Desenvolvimento de Software", pageWidth / 2, 72, { align: "center" });
  
  // Título principal
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("PROPOSTA COMERCIAL", pageWidth / 2, 110, { align: "center" });
  
  // Linha decorativa
  doc.setDrawColor(...COLORS.white);
  doc.setLineWidth(1);
  doc.line(pageWidth / 2 - 40, 118, pageWidth / 2 + 40, 118);
  
  // Info do cliente
  doc.setFillColor(...COLORS.white);
  doc.roundedRect(margin + 20, pageHeight / 2 + 20, contentWidth - 40, 80, 5, 5, "F");
  
  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Preparada para:", margin + 30, pageHeight / 2 + 40);
  
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(data.client.company, margin + 30, pageHeight / 2 + 55);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.darkLight);
  doc.text(`A/C: ${data.client.name}`, margin + 30, pageHeight / 2 + 68);
  doc.text(`${data.client.role}`, margin + 30, pageHeight / 2 + 78);
  
  // Data e número da proposta
  doc.setFontSize(10);
  const rightX = pageWidth - margin - 30;
  doc.text(`Proposta: ${data.proposalNumber}`, rightX, pageHeight / 2 + 40, { align: "right" });
  doc.text(`Data: ${formatDate(new Date())}`, rightX, pageHeight / 2 + 52, { align: "right" });
  doc.text(`Validade: ${formatDate(getValidityDate(PROPOSAL_VALIDITY_DAYS))}`, rightX, pageHeight / 2 + 64, { align: "right" });
  
  // Instagram
  doc.setTextColor(...COLORS.primary);
  doc.setFont("helvetica", "bold");
  doc.text(COMPANY_INFO.instagram, pageWidth / 2, pageHeight - 40, { align: "center" });
  
  // ============================================
  // PÁGINA 2 - APRESENTAÇÃO
  // ============================================
  addNewPage();
  yPosition = 25;
  
  // Título da seção
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("1. APRESENTAÇÃO", margin, yPosition);
  yPosition += 15;
  
  // Sobre a empresa
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.dark);
  
  const aboutLines = doc.splitTextToSize(COMPANY_ABOUT.full, contentWidth);
  doc.text(aboutLines, margin, yPosition);
  yPosition += aboutLines.length * 5 + 10;
  
  // Missão
  doc.setFillColor(...COLORS.light);
  doc.roundedRect(margin, yPosition, contentWidth, 25, 3, 3, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("Nossa Missão:", margin + 5, yPosition + 8);
  
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...COLORS.dark);
  const missionLines = doc.splitTextToSize(COMPANY_ABOUT.mission, contentWidth - 10);
  doc.text(missionLines, margin + 5, yPosition + 16);
  yPosition += 35;
  
  // Diferenciais
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("Nossos Diferenciais", margin, yPosition);
  yPosition += 10;
  
  COMPANY_DIFFERENTIALS.slice(0, 4).forEach((diff, index) => {
    doc.setFillColor(...COLORS.light);
    doc.roundedRect(margin, yPosition, contentWidth, 18, 2, 2, "F");
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.dark);
    doc.text(`✓ ${diff.title}`, margin + 5, yPosition + 7);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.darkLight);
    doc.setFontSize(9);
    doc.text(diff.description, margin + 5, yPosition + 14);
    
    yPosition += 22;
  });
  
  // ============================================
  // PÁGINA 3 - ENTENDIMENTO DO DESAFIO
  // ============================================
  addNewPage();
  yPosition = 25;
  
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("2. ENTENDIMENTO DO DESAFIO", margin, yPosition);
  yPosition += 15;
  
  // Introdução personalizada
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.dark);
  
  const introText = `Com base em nossa conversa, identificamos que ${data.client.company} enfrenta desafios importantes que demandam atenção estratégica. A seguir, apresentamos nosso entendimento do cenário atual:`;
  const introLines = doc.splitTextToSize(introText, contentWidth);
  doc.text(introLines, margin, yPosition);
  yPosition += introLines.length * 5 + 10;
  
  // Desafio Principal
  doc.setFillColor(255, 243, 243); // Vermelho claro
  doc.roundedRect(margin, yPosition, contentWidth, 40, 3, 3, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setTextColor(200, 50, 50);
  doc.text("🎯 Desafio Principal", margin + 5, yPosition + 8);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.dark);
  const obstacleLines = doc.splitTextToSize(data.diagnosis.mainObstacle, contentWidth - 10);
  doc.text(obstacleLines.slice(0, 5), margin + 5, yPosition + 16);
  yPosition += 50;
  
  // Tempo do problema
  const durationLabel = getOptionLabel(PROBLEM_DURATION_OPTIONS, data.diagnosis.problemDuration);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text(`⏱ Tempo do desafio: `, margin, yPosition);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.dark);
  doc.text(durationLabel, margin + 40, yPosition);
  yPosition += 12;
  
  // Motivação
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("💡 Motivação para buscar solução agora:", margin, yPosition);
  yPosition += 7;
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.dark);
  const motivationLines = doc.splitTextToSize(data.diagnosis.motivation, contentWidth);
  doc.text(motivationLines.slice(0, 3), margin, yPosition);
  yPosition += motivationLines.slice(0, 3).length * 5 + 10;
  
  // Tentativas anteriores
  checkNewPage(50);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("🔄 Tentativas anteriores:", margin, yPosition);
  yPosition += 7;
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.dark);
  const attemptsLines = doc.splitTextToSize(data.diagnosis.previousAttempts, contentWidth);
  doc.text(attemptsLines.slice(0, 3), margin, yPosition);
  yPosition += attemptsLines.slice(0, 3).length * 5 + 10;
  
  // Consequências
  doc.setFillColor(255, 250, 230); // Amarelo claro
  doc.roundedRect(margin, yPosition, contentWidth, 35, 3, 3, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setTextColor(200, 150, 0);
  doc.text("⚠️ Impacto se não resolvido:", margin + 5, yPosition + 8);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.dark);
  const consequenceLines = doc.splitTextToSize(data.diagnosis.consequences, contentWidth - 10);
  doc.text(consequenceLines.slice(0, 4), margin + 5, yPosition + 16);
  
  // ============================================
  // PÁGINA 4 - SOLUÇÃO PROPOSTA
  // ============================================
  addNewPage();
  yPosition = 25;
  
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("3. SOLUÇÃO PROPOSTA", margin, yPosition);
  yPosition += 15;
  
  // Visão da solução
  doc.setFillColor(...COLORS.light);
  doc.roundedRect(margin, yPosition, contentWidth, 45, 3, 3, "F");
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("🚀 Sua Visão de Solução Ideal", margin + 5, yPosition + 10);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.dark);
  const solutionLines = doc.splitTextToSize(data.solution.idealSolution, contentWidth - 10);
  doc.text(solutionLines.slice(0, 5), margin + 5, yPosition + 20);
  yPosition += 55;
  
  // Objetivos
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("🎯 Objetivos a Alcançar:", margin, yPosition);
  yPosition += 10;
  
  const objectiveLabels = data.solution.objectives.map(obj => 
    getOptionLabel(OBJECTIVES_OPTIONS, obj)
  );
  
  objectiveLabels.forEach(obj => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.success);
    doc.text("✓", margin + 5, yPosition);
    doc.setTextColor(...COLORS.dark);
    doc.text(obj, margin + 12, yPosition);
    yPosition += 7;
  });
  
  if (data.solution.otherObjective) {
    doc.setTextColor(...COLORS.success);
    doc.text("✓", margin + 5, yPosition);
    doc.setTextColor(...COLORS.dark);
    doc.text(data.solution.otherObjective, margin + 12, yPosition);
    yPosition += 7;
  }
  yPosition += 10;
  
  // Beneficiários e Timeline
  const beneficiariesLabel = getOptionLabel(BENEFICIARIES_OPTIONS, data.solution.beneficiaries);
  const timelineLabel = getOptionLabel(TIMELINE_OPTIONS, data.solution.timeline);
  
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("👥 Beneficiários: ", margin, yPosition);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.dark);
  doc.text(beneficiariesLabel, margin + 35, yPosition);
  yPosition += 10;
  
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("📅 Prazo desejado: ", margin, yPosition);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.dark);
  doc.text(timelineLabel, margin + 38, yPosition);
  
  // ============================================
  // PÁGINA 5 - ESCOPO E PACOTES
  // ============================================
  addNewPage();
  yPosition = 25;
  
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("4. ESCOPO E INVESTIMENTO", margin, yPosition);
  yPosition += 15;
  
  // Renderizar cada pacote
  packages.forEach((pkg, index) => {
    checkNewPage(80);
    
    const isRecommended = index === recommended;
    
    // Container do pacote
    if (isRecommended) {
      doc.setFillColor(...COLORS.primary);
      doc.roundedRect(margin - 2, yPosition - 2, contentWidth + 4, 70, 4, 4, "F");
      doc.setFillColor(...COLORS.white);
    } else {
      doc.setFillColor(...COLORS.light);
    }
    doc.roundedRect(margin, yPosition, contentWidth, 66, 3, 3, "F");
    
    // Badge recomendado
    if (isRecommended) {
      doc.setFillColor(...COLORS.success);
      doc.roundedRect(pageWidth - margin - 40, yPosition + 5, 35, 8, 2, 2, "F");
      doc.setFontSize(7);
      doc.setTextColor(...COLORS.white);
      doc.text("RECOMENDADO", pageWidth - margin - 37, yPosition + 10);
    }
    
    // Nome e preço
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    if (isRecommended) {
      doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    } else {
      doc.setTextColor(COLORS.dark[0], COLORS.dark[1], COLORS.dark[2]);
    }
    doc.text(pkg.name.toUpperCase(), margin + 5, yPosition + 12);
    
    doc.setFontSize(16);
    doc.setTextColor(...COLORS.primary);
    doc.text(formatCurrency(pkg.price), pageWidth - margin - 5, yPosition + 12, { align: "right" });
    
    // Descrição
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.darkLight);
    doc.text(pkg.description, margin + 5, yPosition + 22);
    
    // Features (primeiras 6)
    const featuresPerColumn = 3;
    const columnWidth = (contentWidth - 10) / 2;
    
    pkg.features.slice(0, 6).forEach((feature, fIndex) => {
      const column = fIndex < featuresPerColumn ? 0 : 1;
      const row = fIndex % featuresPerColumn;
      const x = margin + 5 + column * columnWidth;
      const y = yPosition + 32 + row * 10;
      
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.success);
      doc.text("✓", x, y);
      doc.setTextColor(...COLORS.dark);
      const featureText = feature.length > 35 ? feature.substring(0, 35) + "..." : feature;
      doc.text(featureText, x + 6, y);
    });
    
    yPosition += 75;
  });
  
  // ============================================
  // TABELA COMPARATIVA
  // ============================================
  checkNewPage(60);
  yPosition += 10;
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("Comparativo de Pacotes", margin, yPosition);
  yPosition += 10;
  
  // Criar tabela comparativa
  const tableHeaders = ["Característica", ...packages.map(p => p.name)];
  const allFeatures = Array.from(new Set(packages.flatMap(p => p.features))).slice(0, 8);
  
  const tableBody = allFeatures.map(feature => {
    const row = [feature.length > 40 ? feature.substring(0, 40) + "..." : feature];
    packages.forEach(pkg => {
      row.push(pkg.features.includes(feature) ? "✓" : "-");
    });
    return row;
  });
  
  // Adicionar linha de preço
  tableBody.push(["Investimento", ...packages.map(p => formatCurrency(p.price))]);
  
  autoTable(doc, {
    startY: yPosition,
    head: [tableHeaders],
    body: tableBody,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 60 },
    },
  });
  
  // ============================================
  // PÁGINA - CRONOGRAMA
  // ============================================
  addNewPage();
  yPosition = 25;
  
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("5. CRONOGRAMA", margin, yPosition);
  yPosition += 15;
  
  const selectedPackage = packages[recommended];
  const totalTimeline = calculateTimeline(packages, recommended);
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.dark);
  doc.text(`Cronograma estimado para o pacote ${selectedPackage.name}: ${totalTimeline}`, margin, yPosition);
  yPosition += 15;
  
  // Timeline visual
  selectedPackage.deliveryPhases.forEach((phase, index) => {
    doc.setFillColor(...COLORS.primary);
    doc.circle(margin + 5, yPosition + 5, 3, "F");
    
    if (index < selectedPackage.deliveryPhases.length - 1) {
      doc.setDrawColor(...COLORS.primary);
      doc.setLineWidth(0.5);
      doc.line(margin + 5, yPosition + 8, margin + 5, yPosition + 35);
    }
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.dark);
    doc.text(`Fase ${index + 1}: ${phase.name}`, margin + 15, yPosition + 3);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.darkLight);
    doc.text(phase.description, margin + 15, yPosition + 11);
    
    doc.setTextColor(...COLORS.primary);
    doc.text(`Duração: ${phase.duration}`, margin + 15, yPosition + 19);
    
    yPosition += 35;
  });
  
  // ============================================
  // PÁGINA - DIFERENCIAIS E TECNOLOGIAS
  // ============================================
  addNewPage();
  yPosition = 25;
  
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("6. DIFERENCIAIS SKYZ DESIGN BR", margin, yPosition);
  yPosition += 15;
  
  COMPANY_DIFFERENTIALS.forEach(diff => {
    doc.setFillColor(...COLORS.light);
    doc.roundedRect(margin, yPosition, contentWidth, 15, 2, 2, "F");
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.success);
    doc.text("✓", margin + 5, yPosition + 9);
    doc.setTextColor(...COLORS.dark);
    doc.text(diff.title, margin + 12, yPosition + 9);
    
    yPosition += 18;
  });
  
  yPosition += 10;
  
  // Tecnologias
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("Tecnologias e Ferramentas", margin, yPosition);
  yPosition += 10;
  
  const techPerRow = 4;
  const techWidth = contentWidth / techPerRow;
  
  TECHNOLOGIES.forEach((tech, index) => {
    const col = index % techPerRow;
    const row = Math.floor(index / techPerRow);
    
    if (col === 0 && row > 0) {
      // Nova linha
    }
    
    doc.setFillColor(...COLORS.light);
    doc.roundedRect(margin + col * techWidth + 2, yPosition + row * 12, techWidth - 4, 10, 2, 2, "F");
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.dark);
    doc.text(tech.name, margin + col * techWidth + 5, yPosition + row * 12 + 7);
  });
  
  // ============================================
  // PÁGINA - CASOS DE SUCESSO
  // ============================================
  addNewPage();
  yPosition = 25;
  
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("7. CASOS DE SUCESSO", margin, yPosition);
  yPosition += 15;
  
  TESTIMONIALS.slice(0, 2).forEach(testimonial => {
    checkNewPage(60);
    
    doc.setFillColor(...COLORS.light);
    doc.roundedRect(margin, yPosition, contentWidth, 50, 3, 3, "F");
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.dark);
    doc.text(testimonial.client, margin + 5, yPosition + 10);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.darkLight);
    doc.text(`Desafio: ${testimonial.challenge}`, margin + 5, yPosition + 20);
    doc.text(`Solução: ${testimonial.solution}`, margin + 5, yPosition + 28);
    
    doc.setTextColor(...COLORS.success);
    doc.setFont("helvetica", "bold");
    doc.text(`Resultado: ${testimonial.result}`, margin + 5, yPosition + 36);
    
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...COLORS.dark);
    const quoteLines = doc.splitTextToSize(`"${testimonial.quote}"`, contentWidth - 10);
    doc.text(quoteLines[0], margin + 5, yPosition + 45);
    
    yPosition += 58;
  });
  
  // ============================================
  // PÁGINA - TERMOS E CONTATO
  // ============================================
  addNewPage();
  yPosition = 25;
  
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("8. TERMOS E CONDIÇÕES", margin, yPosition);
  yPosition += 15;
  
  TERMS_AND_CONDITIONS.forEach(term => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.dark);
    doc.text(`• ${term.title}`, margin, yPosition);
    yPosition += 6;
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.darkLight);
    const termLines = doc.splitTextToSize(term.content, contentWidth - 10);
    doc.text(termLines, margin + 5, yPosition);
    yPosition += termLines.length * 5 + 8;
  });
  
  // Contato final
  yPosition += 10;
  doc.setFillColor(...COLORS.primary);
  doc.roundedRect(margin, yPosition, contentWidth, 45, 5, 5, "F");
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.white);
  doc.text("Vamos transformar sua visão em realidade!", pageWidth / 2, yPosition + 12, { align: "center" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(COMPANY_INFO.name, pageWidth / 2, yPosition + 24, { align: "center" });
  doc.text(`${COMPANY_INFO.instagram} | ${COMPANY_INFO.email}`, pageWidth / 2, yPosition + 32, { align: "center" });
  doc.text(COMPANY_INFO.phone, pageWidth / 2, yPosition + 40, { align: "center" });
  
  // Adicionar headers e footers em todas as páginas
  const totalPages = doc.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i);
    addHeader();
    addFooter();
  }

  return doc.output("blob");
}
