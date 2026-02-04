import { NextRequest, NextResponse } from "next/server";
import { generateProposalPDF } from "@/lib/generators/generatePDF";
import { generateProposalDOCX } from "@/lib/generators/generateDOCX";
import { proposalDataSchema } from "@/lib/validationSchemas";
import { ProposalData } from "@/types/proposal.types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar dados recebidos
    const validationResult = proposalDataSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados inválidos",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const proposalData: ProposalData = {
      ...validationResult.data,
      proposalNumber: body.proposalNumber,
      createdAt: body.createdAt || new Date().toISOString(),
    };

    // Determinar qual formato gerar baseado no query param
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get("format") || "pdf";

    let fileBlob: Blob;
    let contentType: string;
    let filename: string;

    if (format === "docx") {
      fileBlob = await generateProposalDOCX(proposalData);
      contentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      filename = `Proposta_${proposalData.proposalNumber}_${proposalData.client.company.replace(/\s+/g, "_")}.docx`;
    } else {
      fileBlob = await generateProposalPDF(proposalData);
      contentType = "application/pdf";
      filename = `Proposta_${proposalData.proposalNumber}_${proposalData.client.company.replace(/\s+/g, "_")}.pdf`;
    }

    // Converter Blob para ArrayBuffer
    const arrayBuffer = await fileBlob.arrayBuffer();

    // Retornar o arquivo
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": arrayBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Erro ao gerar proposta:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno ao gerar proposta",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

// Endpoint GET para verificar status da API
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "API de geração de propostas funcionando",
    formats: ["pdf", "docx"],
  });
}
