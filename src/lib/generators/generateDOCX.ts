// ============================================
// GERADOR DE DOCX - V4
// Compatível com schema V2/V3 do Prisma
// Usa docx library
// ============================================

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
  TabStopType,
  TabStopPosition,
  convertInchesToTwip,
} from "docx";
import { getServiceById } from "@/lib/config/services";
import {
  COMPANY_INFO,
  COMPANY_ABOUT,
  COMPANY_DIFFERENTIALS,
  TERMS_AND_CONDITIONS,
} from "@/lib/config/company-content";
import { formatCurrency } from "@/lib/utils";
import type { ProposalForPDF } from "./generatePDF";

// Cores em hex
const COLORS = {
  primary: "0066FF",
  secondary: "6366F1",
  accent: "8B5CF6",
  dark: "1E293B",
  darkLight: "475569",
  light: "F8FAFC",
  success: "10B981",
  white: "FFFFFF",
};

const TIMELINE_LABELS: Record<string, string> = {
  urgente: "Entrega Urgente (até 3 dias)",
  normal: "Prazo Normal (1-2 semanas)",
  flexivel: "Prazo Flexível",
};

const CHALLENGE_LABELS: Record<string, string> = {
  visibility: "Aumentar visibilidade online",
  sales: "Gerar mais vendas",
  branding: "Fortalecer a marca",
  engagement: "Aumentar engajamento",
  presence: "Criar presença digital",
  conversion: "Melhorar conversão",
};

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

// ============================================
// MAIN EXPORT - Generates DOCX from V3 Proposal
// Returns: Buffer (Node.js) for API routes
// ============================================
export async function generateProposalDOCXBuffer(
  proposal: ProposalForPDF
): Promise<Buffer> {
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

  const serviceName = service?.name || proposal.mainService;
  const categoryLabel =
    proposal.category === "design"
      ? "Design & Social Media"
      : "Desenvolvimento Web";

  // Build package sections
  const packageSections: Paragraph[] = [];

  // Recommended package
  if (recommendedPkg) {
    packageSections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "⭐ PACOTE RECOMENDADO",
            bold: true,
            size: 24,
            color: COLORS.success,
          }),
        ],
        spacing: { before: 300, after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: recommendedPkg.name,
            bold: true,
            size: 28,
            color: COLORS.primary,
          }),
        ],
        shading: { type: ShadingType.SOLID, color: "E8F4FF" },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Investimento: ${formatCurrency(recommendedPkg.price)}`,
            bold: true,
            size: 24,
            color: COLORS.primary,
          }),
        ],
        spacing: { after: 100 },
      })
    );

    if (recommendedPkg.description) {
      packageSections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: recommendedPkg.description,
              size: 20,
              italics: true,
              color: COLORS.darkLight,
            }),
          ],
          spacing: { after: 100 },
        })
      );
    }

    packageSections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Prazo de entrega: ${recommendedPkg.deliveryTime}`,
            size: 20,
            color: COLORS.darkLight,
          }),
        ],
        spacing: { after: 150 },
      })
    );

    if (recommendedPkg.includes && recommendedPkg.includes.length > 0) {
      packageSections.push(
        new Paragraph({
          children: [
            new TextRun({ text: "O que está incluso:", bold: true, size: 22 }),
          ],
          spacing: { before: 100 },
        })
      );
      recommendedPkg.includes.forEach((item) => {
        packageSections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "✓ ",
                color: COLORS.success,
                bold: true,
              }),
              new TextRun({ text: item, size: 20 }),
            ],
            indent: { left: 300 },
            spacing: { after: 40 },
          })
        );
      });
    }

    if (recommendedPkg.benefits && recommendedPkg.benefits.length > 0) {
      packageSections.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Benefícios:", bold: true, size: 22 }),
          ],
          spacing: { before: 150 },
        })
      );
      recommendedPkg.benefits.forEach((benefit) => {
        packageSections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "+ ",
                color: COLORS.accent,
                bold: true,
              }),
              new TextRun({ text: benefit, size: 20 }),
            ],
            indent: { left: 300 },
            spacing: { after: 40 },
          })
        );
      });
    }
  }

  // Alternative packages table
  const altPackageSections: Paragraph[] = [];
  if (alternativePkgs.length > 0) {
    altPackageSections.push(
      new Paragraph({
        text: "Outras Opções",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400 },
      })
    );

    const headerRow = new TableRow({
      children: [
        createHeaderCell("Pacote", 35),
        createHeaderCell("Tipo", 20),
        createHeaderCell("Investimento", 25),
        createHeaderCell("Prazo", 20),
      ],
    });

    const altRows = alternativePkgs.map(
      (pkg, index) =>
        new TableRow({
          children: [
            createBodyCell(pkg.name, index, false, true),
            createBodyCell(pkg.tag || "", index),
            createBodyCell(formatCurrency(pkg.price), index, true),
            createBodyCell(pkg.deliveryTime, index),
          ],
        })
    );

    altPackageSections.push(
      new Table({
        rows: [headerRow, ...altRows],
        width: { size: 100, type: WidthType.PERCENTAGE },
      }) as unknown as Paragraph
    );
  }

  // Combos sections
  const comboSections: Paragraph[] = [];
  if (combos.length > 0) {
    comboSections.push(
      new Paragraph({
        text: "Combos Especiais",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400 },
      })
    );

    combos.forEach((combo) => {
      comboSections.push(
        new Paragraph({
          children: [
            ...(combo.tag
              ? [
                  new TextRun({
                    text: `[${combo.tag}] `,
                    bold: true,
                    size: 20,
                    color: COLORS.accent,
                  }),
                ]
              : []),
            new TextRun({
              text: combo.name,
              bold: true,
              size: 24,
              color: COLORS.dark,
            }),
          ],
          spacing: { before: 200 },
          shading: { type: ShadingType.SOLID, color: COLORS.light },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `${formatCurrency(combo.price)}`,
              bold: true,
              size: 24,
              color: COLORS.primary,
            }),
            ...(combo.originalPrice && combo.discount
              ? [
                  new TextRun({ text: "  " }),
                  new TextRun({
                    text: `${formatCurrency(combo.originalPrice)}`,
                    strike: true,
                    size: 20,
                    color: COLORS.darkLight,
                  }),
                  new TextRun({
                    text: ` (-${combo.discount}%)`,
                    bold: true,
                    size: 20,
                    color: COLORS.success,
                  }),
                ]
              : []),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: combo.description,
              size: 20,
              color: COLORS.darkLight,
            }),
          ],
          spacing: { after: 150 },
        })
      );
    });
  }

  // Challenges text
  const challengeLabels = challenges.map(
    (c) => CHALLENGE_LABELS[c] || c
  );

  // ============================================
  // BUILD DOCUMENT
  // ============================================
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
          paragraph: { spacing: { before: 400, after: 200 } },
        },
        heading2: {
          run: {
            size: 28,
            bold: true,
            color: COLORS.primary,
            font: "Calibri",
          },
          paragraph: { spacing: { before: 300, after: 150 } },
        },
        heading3: {
          run: {
            size: 24,
            bold: true,
            color: COLORS.dark,
            font: "Calibri",
          },
          paragraph: { spacing: { before: 200, after: 100 } },
        },
        document: {
          run: { size: 22, font: "Calibri", color: COLORS.dark },
          paragraph: { spacing: { line: 360 } },
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
          new Paragraph({ text: "", spacing: { before: 2000 } }),

          // Logo / Company name
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

          // Decorative line
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

          // Title
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
            spacing: { after: 200 },
          }),

          // Proposal number
          new Paragraph({
            children: [
              new TextRun({
                text: `Nº ${proposal.proposalNumber}`,
                size: 24,
                color: COLORS.darkLight,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
          }),

          // Client info
          new Paragraph({
            children: [
              new TextRun({
                text: "Preparada para:",
                size: 22,
                color: COLORS.darkLight,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: proposal.clientCompany
                  ? `${proposal.clientName} - ${proposal.clientCompany}`
                  : proposal.clientName,
                bold: true,
                size: 36,
                color: COLORS.dark,
                font: "Calibri",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 1000 },
          }),

          // Dates
          new Paragraph({
            children: [
              new TextRun({
                text: `Data: ${fmtDate(proposal.createdAt)}`,
                size: 20,
                color: COLORS.darkLight,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Válida até: ${fmtDate(proposal.validUntil)}`,
                size: 20,
                color: COLORS.darkLight,
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
                    text: `\t\t\tProposta ${proposal.proposalNumber}`,
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
                    text: `${COMPANY_INFO.instagram} | ${COMPANY_INFO.email} | ${COMPANY_INFO.phone}`,
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
          // 1. DADOS DO CLIENTE
          // ============================================
          new Paragraph({
            text: "1. DADOS DO CLIENTE",
            heading: HeadingLevel.HEADING_1,
          }),

          createInfoParagraph("Nome", proposal.clientName),
          createInfoParagraph("E-mail", proposal.clientEmail),
          ...(proposal.clientPhone
            ? [createInfoParagraph("Telefone", proposal.clientPhone)]
            : []),
          ...(proposal.clientCompany
            ? [createInfoParagraph("Empresa", proposal.clientCompany)]
            : []),
          ...(proposal.clientSegment
            ? [createInfoParagraph("Segmento", proposal.clientSegment)]
            : []),

          new Paragraph({ children: [new PageBreak()] }),

          // ============================================
          // 2. SERVIÇO SOLICITADO
          // ============================================
          new Paragraph({
            text: "2. SERVIÇO SOLICITADO",
            heading: HeadingLevel.HEADING_1,
          }),

          createInfoParagraph("Serviço", serviceName),
          createInfoParagraph("Categoria", categoryLabel),
          createInfoParagraph(
            "Prazo",
            TIMELINE_LABELS[proposal.timeline] || proposal.timeline
          ),

          // Challenges/Objectives
          ...(challengeLabels.length > 0
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Objetivos:",
                      bold: true,
                      size: 22,
                      color: COLORS.primary,
                    }),
                  ],
                  spacing: { before: 200 },
                }),
                ...challengeLabels.map(
                  (ch) =>
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "• ",
                          color: COLORS.success,
                          bold: true,
                        }),
                        new TextRun({ text: ch, size: 20 }),
                      ],
                      indent: { left: 300 },
                      spacing: { after: 40 },
                    })
                ),
              ]
            : []),

          // Branding info
          ...(proposal.hasBranding
            ? [
                createInfoParagraph(
                  "Identidade Visual",
                  proposal.hasBranding === "sim"
                    ? "Já possui"
                    : proposal.hasBranding === "nao"
                    ? "Não possui"
                    : "Precisa atualizar"
                ),
              ]
            : []),

          new Paragraph({ children: [new PageBreak()] }),

          // ============================================
          // 3. APRESENTAÇÃO SKYZ DESIGN
          // ============================================
          new Paragraph({
            text: "3. SOBRE A SKYZ DESIGN",
            heading: HeadingLevel.HEADING_1,
          }),

          new Paragraph({
            children: [
              new TextRun({ text: COMPANY_ABOUT.full, size: 22 }),
            ],
            spacing: { after: 300 },
          }),

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
            shading: { type: ShadingType.SOLID, color: COLORS.light },
          }),

          // Differentials
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
          // 4. ESCOPO E INVESTIMENTO
          // ============================================
          new Paragraph({
            text: "4. ESCOPO E INVESTIMENTO",
            heading: HeadingLevel.HEADING_1,
          }),

          ...packageSections,
          ...altPackageSections,
          ...comboSections,

          new Paragraph({ children: [new PageBreak()] }),

          // ============================================
          // 5. PRÓXIMOS PASSOS
          // ============================================
          new Paragraph({
            text: "5. PRÓXIMOS PASSOS",
            heading: HeadingLevel.HEADING_1,
          }),

          createStepParagraph(
            "1",
            "Analise os pacotes apresentados nesta proposta"
          ),
          createStepParagraph(
            "2",
            "Escolha o pacote que melhor atende suas necessidades"
          ),
          createStepParagraph(
            "3",
            "Entre em contato conosco via WhatsApp ou e-mail"
          ),
          createStepParagraph(
            "4",
            "Agendaremos uma reunião para alinhar detalhes"
          ),
          createStepParagraph(
            "5",
            "Iniciamos o projeto imediatamente após aprovação"
          ),

          new Paragraph({ children: [new PageBreak()] }),

          // ============================================
          // 6. TERMOS E CONDIÇÕES
          // ============================================
          new Paragraph({
            text: "6. TERMOS E CONDIÇÕES",
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
              children: [
                new TextRun({ text: term.content, size: 20 }),
              ],
              indent: { left: 300 },
              spacing: { after: 100 },
            }),
          ]),

          // ============================================
          // CONTACT CTA
          // ============================================
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
                text: "Vamos começar?",
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
                text: `WhatsApp: ${COMPANY_INFO.phone} | E-mail: ${COMPANY_INFO.email}`,
                size: 20,
                color: COLORS.darkLight,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `${COMPANY_INFO.instagram} | ${COMPANY_INFO.website}`,
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

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function createInfoParagraph(label: string, value: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: `${label}: `,
        bold: true,
        size: 22,
        color: COLORS.darkLight,
      }),
      new TextRun({
        text: value,
        size: 22,
        color: COLORS.dark,
      }),
    ],
    spacing: { after: 80 },
  });
}

function createStepParagraph(num: string, text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: `${num}. `,
        bold: true,
        size: 24,
        color: COLORS.primary,
      }),
      new TextRun({
        text: text,
        size: 22,
      }),
    ],
    spacing: { after: 120 },
  });
}

function createHeaderCell(text: string, widthPct: number): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: true,
            color: COLORS.white,
            size: 20,
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
    ],
    shading: { type: ShadingType.SOLID, color: COLORS.primary },
    width: { size: widthPct, type: WidthType.PERCENTAGE },
  });
}

function createBodyCell(
  text: string,
  rowIndex: number,
  isPrimary = false,
  isBold = false
): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            size: 20,
            bold: isBold,
            color: isPrimary ? COLORS.primary : COLORS.dark,
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
    ],
    shading:
      rowIndex % 2 === 0
        ? { type: ShadingType.SOLID, color: COLORS.light }
        : undefined,
  });
}
