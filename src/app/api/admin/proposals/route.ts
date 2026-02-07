import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering since we use searchParams
export const dynamic = "force-dynamic";

// ============================================
// ADMIN API - List all proposals with filters
// ============================================

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build where clause
    const where: Record<string, unknown> = {};
    
    if (status && status !== "all") {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { clientName: { contains: search, mode: "insensitive" } },
        { clientEmail: { contains: search, mode: "insensitive" } },
        { clientCompany: { contains: search, mode: "insensitive" } },
        { proposalNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    // Fetch total count
    const total = await prisma.proposal.count({ where });

    // Fetch proposals
    const proposals = await prisma.proposal.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        proposalNumber: true,
        clientName: true,
        clientEmail: true,
        clientCompany: true,
        category: true,
        mainService: true,
        status: true,
        viewCount: true,
        createdAt: true,
        validUntil: true,
        emailSentAt: true,
        lastViewedAt: true,
        recommendedPackage: true,
      },
    });

    // Parse recommendedPackage to get price
    const proposalsWithPrice = proposals.map((p) => {
      let price = 0;
      try {
        if (p.recommendedPackage) {
          const pkg = JSON.parse(p.recommendedPackage);
          price = pkg.price || 0;
        }
      } catch {}
      return { ...p, price };
    });

    // Compute summary stats
    const stats = await prisma.proposal.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    const statusCounts: Record<string, number> = {};
    stats.forEach((s) => {
      statusCounts[s.status] = s._count.id;
    });

    return NextResponse.json({
      proposals: proposalsWithPrice,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      stats: statusCounts,
    });
  } catch (error) {
    console.error("Erro ao buscar propostas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar propostas" },
      { status: 500 }
    );
  }
}
