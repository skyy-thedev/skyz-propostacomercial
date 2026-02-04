"use client";

import { ProposalFromDB } from "@/types/database.types";
import ProposalViewer from "./ProposalViewer";
import ProposalActions from "./ProposalActions";

interface ProposalPageClientProps {
  proposal: ProposalFromDB;
  isExpired: boolean;
}

export default function ProposalPageClient({
  proposal,
  isExpired,
}: ProposalPageClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50">
      {/* Header fixo com ações */}
      <ProposalActions
        proposalId={proposal.id}
        proposalNumber={proposal.proposalNumber}
        isExpired={isExpired}
      />

      {/* Container da proposta */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <ProposalViewer proposal={proposal} isExpired={isExpired} />
      </main>

      {/* Footer simples */}
      <footer className="text-center py-8 text-dark-400 text-sm print:hidden">
        <p>
          © {new Date().getFullYear()} Skyz Design BR. Todos os direitos
          reservados.
        </p>
        <p className="mt-1">
          Proposta Nº {proposal.proposalNumber} • Visualizações:{" "}
          {proposal.viewCount}
        </p>
      </footer>
    </div>
  );
}
