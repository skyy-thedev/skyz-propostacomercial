import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateProposalDOCXBuffer } from "@/lib/generators";

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

    const docxBuffer = await generateProposalDOCXBuffer(proposal);
    const uint8 = new Uint8Array(docxBuffer);

    return new NextResponse(uint8, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="proposta-${proposal.proposalNumber}.docx"`,
        "Content-Length": docxBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Erro ao gerar DOCX:", error);
    return NextResponse.json({ error: "Erro ao gerar DOCX" }, { status: 500 });
  }
}
