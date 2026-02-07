import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateProposalPDFBuffer } from "@/lib/generators";

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

    const pdfBuffer = generateProposalPDFBuffer(proposal);
    const uint8 = new Uint8Array(pdfBuffer);

    return new NextResponse(uint8, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="proposta-${proposal.proposalNumber}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return NextResponse.json({ error: "Erro ao gerar PDF" }, { status: 500 });
  }
}
