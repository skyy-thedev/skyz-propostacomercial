import { NextRequest, NextResponse } from "next/server";

// ============================================
// LEGACY V1 ROUTE - DEPRECATED
// Use /api/proposals/create para criar propostas
// Use /api/proposals/[id]/pdf para gerar PDF
// Use /api/proposals/[id]/docx para gerar DOCX
// ============================================

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: "Esta API foi descontinuada na V4.",
      message: "Use /api/proposals/create para criar propostas e /api/proposals/[id]/pdf ou /docx para gerar documentos.",
    },
    { status: 410 }
  );
}

export async function GET() {
  return NextResponse.json({
    status: "deprecated",
    message: "Use /api/proposals/create + /api/proposals/[id]/pdf ou /docx",
    formats: ["pdf", "docx"],
  });
}
