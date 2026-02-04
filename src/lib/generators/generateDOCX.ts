import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  PageBreak,
  Header,
  Footer,
  ImageRun,
  TabStopType,
  TabStopPosition,
  convertInchesToTwip,
} from "docx";
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
  OBJECTIVES_OPTIONS,
} from "@/types/proposal.types";
import { generatePackages, calculateTimeline } from "./packageGenerator";

// Cores em hex
const COLORS = {
  primary: "0066FF",
  secondary: "6366F1",
  dark: "1E293B",
  darkLight: "475569",
  light: "F8FAFC",
  success: "10B981",
  white: "FFFFFF",
};

export async function generateProposalDOCX(data: ProposalData): Promise<Blob> {
  // Gerar pacotes baseados nos dados
  const { packages, recommended } = generatePackages(
    data.commercial.budget,
    data.commercial.packagesNumber,
    data.solution.objectives
  );

  const selectedPackage = packages[recommended];
  const totalTimeline = calculateTimeline(packages, recommended);

  // Criar documento
  const doc = new Document({
    styles: {
      default: {
        heading1: {
          run: {
            size: 36,
            bold: true,
            color: COLORS.primary,
            font: "Calibri",
          },
          paragraph: {
            spacing: { before: 400, after: 200 },
          },
        },
        heading2: {
          run: {
            size: 28,
            bold: true,
            color: COLORS.primary,
            font: "Calibri",
          },
          paragraph: {
            spacing: { before: 300, after: 150 },
          },
        },
        heading3: {
          run: {
            size: 24,
            bold: true,
            color: COLORS.dark,
            font: "Calibri",
          },
          paragraph: {
            spacing: { before: 200, after: 100 },
          },
        },
        document: {
          run: {
            size: 22,
            font: "Calibri",
            color: COLORS.dark,
          },
          paragraph: {
            spacing: { line: 360 },
          },
        },
      },
    },
    sections: [
      // ============================================
      // CAPA
      // ============================================
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
          },
        },
        children: [
          // Espaçamento superior
          new Paragraph({ text: "", spacing: { before: 2000 } }),
          
          // Logo/Nome da empresa
          new Paragraph({
            children: [
              new TextRun({
                text: COMPANY_INFO.name.toUpperCase(),
                bold: true,
                size: 56,
                color: COLORS.primary,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: "Design & Desenvolvimento de Software",
                size: 24,
                color: COLORS.darkLight,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
          }),
          
          // Linha decorativa
          new Paragraph({
            children: [
              new TextRun({
                text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
                color: COLORS.primary,
                size: 20,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          
          // Título
          new Paragraph({
            children: [
              new TextRun({
                text: "PROPOSTA COMERCIAL",
                bold: true,
                size: 48,
                color: COLORS.dark,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
          }),
          
          // Info do cliente
          new Paragraph({
            children: [
              new TextRun({
                text: "Preparada para:",
                size: 22,
                color: COLORS.darkLight,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: data.client.company,
                bold: true,
                size: 36,
                color: COLORS.dark,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: `A/C: ${data.client.name}`,
                size: 24,
                color: COLORS.darkLight,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: data.client.role,
                size: 22,
                color: COLORS.darkLight,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 1000 },
          }),
          
          // Data e número da proposta
          new Paragraph({
            children: [
              new TextRun({
                text: `Proposta: ${data.proposalNumber}`,
                size: 20,
                color: COLORS.darkLight,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: `Data: ${formatDate(new Date())}`,
                size: 20,
                color: COLORS.darkLight,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: `Validade: ${formatDate(getValidityDate(PROPOSAL_VALIDITY_DAYS))}`,
                size: 20,
                color: COLORS.darkLight,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 1500 },
          }),
          
          // Instagram
          new Paragraph({
            children: [
              new TextRun({
                text: COMPANY_INFO.instagram,
                bold: true,
                size: 24,
                color: COLORS.primary,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
      },
      
      // ============================================
      // CONTEÚDO PRINCIPAL
      // ============================================
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.8),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(0.8),
              left: convertInchesToTwip(1),
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: COMPANY_INFO.name,
                    color: COLORS.primary,
                    size: 18,
                    bold: true,
                  }),
                  new TextRun({
                    text: `\t\t\tProposta ${data.proposalNumber}`,
                    color: COLORS.darkLight,
                    size: 18,
                  }),
                ],
                tabStops: [
                  {
                    type: TabStopType.RIGHT,
                    position: TabStopPosition.MAX,
                  },
                ],
                border: {
                  bottom: {
                    color: COLORS.primary,
                    space: 1,
                    size: 6,
                    style: BorderStyle.SINGLE,
                  },
                },
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${COMPANY_INFO.instagram} | ${COMPANY_INFO.email}`,
                    color: COLORS.darkLight,
                    size: 16,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        children: [
          // ============================================
          // 1. APRESENTAÇÃO
          // ============================================
          new Paragraph({
            text: "1. APRESENTAÇÃO",
            heading: HeadingLevel.HEADING_1,
          }),
          
          new Paragraph({
            children: [new TextRun({ text: COMPANY_ABOUT.full, size: 22 })],
            spacing: { after: 300 },
          }),
          
          // Missão
          new Paragraph({
            children: [
              new TextRun({
                text: "Nossa Missão: ",
                bold: true,
                size: 22,
                color: COLORS.primary,
              }),
              new TextRun({
                text: COMPANY_ABOUT.mission,
                italics: true,
                size: 22,
              }),
            ],
            spacing: { after: 400 },
            shading: {
              type: ShadingType.SOLID,
              color: COLORS.light,
            },
          }),
          
          // Diferenciais
          new Paragraph({
            text: "Nossos Diferenciais",
            heading: HeadingLevel.HEADING_3,
          }),
          
          ...COMPANY_DIFFERENTIALS.map(
            (diff) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: "✓ ",
                    color: COLORS.success,
                    bold: true,
                  }),
                  new TextRun({
                    text: `${diff.title}: `,
                    bold: true,
                  }),
                  new TextRun({
                    text: diff.description,
                    color: COLORS.darkLight,
                  }),
                ],
                spacing: { after: 100 },
              })
          ),
          
          new Paragraph({ children: [new PageBreak()] }),
          
          // ============================================
          // 2. ENTENDIMENTO DO DESAFIO
          // ============================================
          new Paragraph({
            text: "2. ENTENDIMENTO DO DESAFIO",
            heading: HeadingLevel.HEADING_1,
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: `Com base em nossa conversa, identificamos que ${data.client.company} enfrenta desafios importantes que demandam atenção estratégica.`,
                size: 22,
              }),
            ],
            spacing: { after: 300 },
          }),
          
          // Desafio Principal
          new Paragraph({
            children: [
              new TextRun({
                text: "🎯 Desafio Principal",
                bold: true,
                size: 24,
                color: COLORS.primary,
              }),
            ],
            spacing: { before: 200 },
          }),
          
          new Paragraph({
            children: [new TextRun({ text: data.diagnosis.mainObstacle, size: 22 })],
            spacing: { after: 300 },
          }),
          
          // Tempo do problema
          new Paragraph({
            children: [
              new TextRun({
                text: "⏱ Tempo do desafio: ",
                bold: true,
                color: COLORS.primary,
              }),
              new TextRun({
                text: getOptionLabel(PROBLEM_DURATION_OPTIONS, data.diagnosis.problemDuration),
              }),
            ],
            spacing: { after: 200 },
          }),
          
          // Motivação
          new Paragraph({
            children: [
              new TextRun({
                text: "💡 Motivação para buscar solução agora:",
                bold: true,
                color: COLORS.primary,
              }),
            ],
          }),
          
          new Paragraph({
            children: [new TextRun({ text: data.diagnosis.motivation, size: 22 })],
            spacing: { after: 300 },
          }),
          
          // Tentativas anteriores
          new Paragraph({
            children: [
              new TextRun({
                text: "🔄 Tentativas anteriores:",
                bold: true,
                color: COLORS.primary,
              }),
            ],
          }),
          
          new Paragraph({
            children: [new TextRun({ text: data.diagnosis.previousAttempts, size: 22 })],
            spacing: { after: 200 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: "Por que não funcionaram: ",
                bold: true,
              }),
              new TextRun({ text: data.diagnosis.whyFailed }),
            ],
            spacing: { after: 300 },
          }),
          
          // Consequências
          new Paragraph({
            children: [
              new TextRun({
                text: "⚠️ Impacto se não resolvido:",
                bold: true,
                color: "CC9900",
              }),
            ],
          }),
          
          new Paragraph({
            children: [new TextRun({ text: data.diagnosis.consequences, size: 22 })],
            spacing: { after: 300 },
            shading: {
              type: ShadingType.SOLID,
              color: "FFF8E1",
            },
          }),
          
          new Paragraph({ children: [new PageBreak()] }),
          
          // ============================================
          // 3. SOLUÇÃO PROPOSTA
          // ============================================
          new Paragraph({
            text: "3. SOLUÇÃO PROPOSTA",
            heading: HeadingLevel.HEADING_1,
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: "🚀 Sua Visão de Solução Ideal",
                bold: true,
                size: 24,
                color: COLORS.primary,
              }),
            ],
          }),
          
          new Paragraph({
            children: [new TextRun({ text: data.solution.idealSolution, size: 22 })],
            spacing: { after: 300 },
            shading: {
              type: ShadingType.SOLID,
              color: COLORS.light,
            },
          }),
          
          // Objetivos
          new Paragraph({
            children: [
              new TextRun({
                text: "🎯 Objetivos a Alcançar:",
                bold: true,
                size: 24,
                color: COLORS.primary,
              }),
            ],
            spacing: { before: 200 },
          }),
          
          ...data.solution.objectives.map(
            (obj) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: "✓ ",
                    color: COLORS.success,
                    bold: true,
                  }),
                  new TextRun({
                    text: getOptionLabel(OBJECTIVES_OPTIONS, obj),
                  }),
                ],
                spacing: { after: 80 },
              })
          ),
          
          ...(data.solution.otherObjective
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "✓ ",
                      color: COLORS.success,
                      bold: true,
                    }),
                    new TextRun({ text: data.solution.otherObjective }),
                  ],
                  spacing: { after: 80 },
                }),
              ]
            : []),
          
          new Paragraph({
            children: [
              new TextRun({
                text: "👥 Beneficiários: ",
                bold: true,
                color: COLORS.primary,
              }),
              new TextRun({
                text: getOptionLabel(BENEFICIARIES_OPTIONS, data.solution.beneficiaries),
              }),
            ],
            spacing: { before: 200, after: 100 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: "📅 Prazo desejado: ",
                bold: true,
                color: COLORS.primary,
              }),
              new TextRun({
                text: getOptionLabel(TIMELINE_OPTIONS, data.solution.timeline),
              }),
            ],
            spacing: { after: 300 },
          }),
          
          new Paragraph({ children: [new PageBreak()] }),
          
          // ============================================
          // 4. ESCOPO E INVESTIMENTO
          // ============================================
          new Paragraph({
            text: "4. ESCOPO E INVESTIMENTO",
            heading: HeadingLevel.HEADING_1,
          }),
          
          // Pacotes
          ...packages.flatMap((pkg, index) => {
            const isRecommended = index === recommended;
            return [
              new Paragraph({
                children: [
                  new TextRun({
                    text: pkg.name.toUpperCase(),
                    bold: true,
                    size: 28,
                    color: isRecommended ? COLORS.primary : COLORS.dark,
                  }),
                  ...(isRecommended
                    ? [
                        new TextRun({
                          text: " ⭐ RECOMENDADO",
                          bold: true,
                          size: 20,
                          color: COLORS.success,
                        }),
                      ]
                    : []),
                ],
                spacing: { before: 300 },
                shading: isRecommended
                  ? { type: ShadingType.SOLID, color: "E8F4FF" }
                  : undefined,
              }),
              
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Investimento: ${formatCurrency(pkg.price)}`,
                    bold: true,
                    size: 24,
                    color: COLORS.primary,
                  }),
                ],
                spacing: { after: 100 },
              }),
              
              new Paragraph({
                children: [new TextRun({ text: pkg.description, size: 20, italics: true })],
                spacing: { after: 150 },
              }),
              
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Inclui:",
                    bold: true,
                    size: 20,
                  }),
                ],
              }),
              
              ...pkg.features.map(
                (feature) =>
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "✓ ",
                        color: COLORS.success,
                        bold: true,
                      }),
                      new TextRun({ text: feature, size: 20 }),
                    ],
                    indent: { left: 300 },
                  })
              ),
              
              new Paragraph({ text: "", spacing: { after: 200 } }),
            ];
          }),
          
          new Paragraph({ children: [new PageBreak()] }),
          
          // Tabela comparativa
          new Paragraph({
            text: "Comparativo de Pacotes",
            heading: HeadingLevel.HEADING_2,
          }),
          
          createComparisonTable(packages),
          
          new Paragraph({ children: [new PageBreak()] }),
          
          // ============================================
          // 5. CRONOGRAMA
          // ============================================
          new Paragraph({
            text: "5. CRONOGRAMA",
            heading: HeadingLevel.HEADING_1,
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: `Cronograma estimado para o pacote ${selectedPackage.name}: `,
              }),
              new TextRun({
                text: totalTimeline,
                bold: true,
                color: COLORS.primary,
              }),
            ],
            spacing: { after: 300 },
          }),
          
          ...selectedPackage.deliveryPhases.flatMap((phase, index) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Fase ${index + 1}: ${phase.name}`,
                  bold: true,
                  size: 24,
                  color: COLORS.primary,
                }),
              ],
              spacing: { before: 200 },
            }),
            new Paragraph({
              children: [new TextRun({ text: phase.description, size: 20 })],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Duração: ${phase.duration}`,
                  italics: true,
                  color: COLORS.darkLight,
                }),
              ],
              spacing: { after: 150 },
            }),
          ]),
          
          new Paragraph({ children: [new PageBreak()] }),
          
          // ============================================
          // 6. DIFERENCIAIS
          // ============================================
          new Paragraph({
            text: "6. DIFERENCIAIS SKYZ DESIGN BR",
            heading: HeadingLevel.HEADING_1,
          }),
          
          ...COMPANY_DIFFERENTIALS.map(
            (diff) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: "✓ ",
                    color: COLORS.success,
                    bold: true,
                    size: 24,
                  }),
                  new TextRun({
                    text: diff.title,
                    bold: true,
                    size: 22,
                  }),
                ],
                spacing: { after: 100 },
              })
          ),
          
          new Paragraph({
            text: "Tecnologias e Ferramentas",
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 400 },
          }),
          
          new Paragraph({
            children: TECHNOLOGIES.map((tech, index) => [
              new TextRun({ text: tech.name }),
              ...(index < TECHNOLOGIES.length - 1
                ? [new TextRun({ text: " • " })]
                : []),
            ]).flat(),
            spacing: { after: 300 },
          }),
          
          new Paragraph({ children: [new PageBreak()] }),
          
          // ============================================
          // 7. CASOS DE SUCESSO
          // ============================================
          new Paragraph({
            text: "7. CASOS DE SUCESSO",
            heading: HeadingLevel.HEADING_1,
          }),
          
          ...TESTIMONIALS.slice(0, 2).flatMap((testimonial) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: testimonial.client,
                  bold: true,
                  size: 24,
                  color: COLORS.primary,
                }),
              ],
              spacing: { before: 300 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Desafio: ", bold: true }),
                new TextRun({ text: testimonial.challenge }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Solução: ", bold: true }),
                new TextRun({ text: testimonial.solution }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Resultado: ", bold: true, color: COLORS.success }),
                new TextRun({ text: testimonial.result, bold: true }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `"${testimonial.quote}"`,
                  italics: true,
                  color: COLORS.darkLight,
                }),
              ],
              spacing: { after: 200 },
            }),
          ]),
          
          new Paragraph({ children: [new PageBreak()] }),
          
          // ============================================
          // 8. TERMOS E CONDIÇÕES
          // ============================================
          new Paragraph({
            text: "8. TERMOS E CONDIÇÕES",
            heading: HeadingLevel.HEADING_1,
          }),
          
          ...TERMS_AND_CONDITIONS.flatMap((term) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${term.title}`,
                  bold: true,
                  size: 22,
                }),
              ],
              spacing: { before: 150 },
            }),
            new Paragraph({
              children: [new TextRun({ text: term.content, size: 20 })],
              indent: { left: 300 },
              spacing: { after: 100 },
            }),
          ]),
          
          // Contato final
          new Paragraph({
            children: [
              new TextRun({
                text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
                color: COLORS.primary,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 500 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: "Vamos transformar sua visão em realidade!",
                bold: true,
                size: 28,
                color: COLORS.primary,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: COMPANY_INFO.name,
                bold: true,
                size: 24,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: `${COMPANY_INFO.instagram} | ${COMPANY_INFO.email}`,
                size: 20,
                color: COLORS.darkLight,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: COMPANY_INFO.phone,
                size: 20,
                color: COLORS.darkLight,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
      },
    ],
  });

  return Packer.toBlob(doc);
}

// Função auxiliar para criar tabela comparativa
function createComparisonTable(packages: { name: string; price: number; features: string[] }[]): Table {
  // Coletar todas as features únicas
  const allFeatures = Array.from(new Set(packages.flatMap((p) => p.features))).slice(0, 10);

  // Criar linhas da tabela
  const headerRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: "Característica", bold: true, color: COLORS.white }),
            ],
          }),
        ],
        shading: { type: ShadingType.SOLID, color: COLORS.primary },
        width: { size: 40, type: WidthType.PERCENTAGE },
      }),
      ...packages.map(
        (pkg) =>
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: pkg.name, bold: true, color: COLORS.white }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            shading: { type: ShadingType.SOLID, color: COLORS.primary },
          })
      ),
    ],
  });

  const featureRows = allFeatures.map(
    (feature, index) =>
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: feature.length > 50 ? feature.substring(0, 50) + "..." : feature,
                    size: 18,
                  }),
                ],
              }),
            ],
            shading:
              index % 2 === 0
                ? { type: ShadingType.SOLID, color: COLORS.light }
                : undefined,
          }),
          ...packages.map(
            (pkg) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: pkg.features.includes(feature) ? "✓" : "—",
                        color: pkg.features.includes(feature) ? COLORS.success : COLORS.darkLight,
                        bold: pkg.features.includes(feature),
                        size: 22,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                shading:
                  index % 2 === 0
                    ? { type: ShadingType.SOLID, color: COLORS.light }
                    : undefined,
              })
          ),
        ],
      })
  );

  // Linha de preço
  const priceRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: "Investimento", bold: true })],
          }),
        ],
        shading: { type: ShadingType.SOLID, color: "E8F4FF" },
      }),
      ...packages.map(
        (pkg) =>
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: formatCurrency(pkg.price),
                    bold: true,
                    color: COLORS.primary,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            shading: { type: ShadingType.SOLID, color: "E8F4FF" },
          })
      ),
    ],
  });

  return new Table({
    rows: [headerRow, ...featureRows, priceRow],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}
