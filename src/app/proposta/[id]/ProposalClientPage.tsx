"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProposalFromDB } from "@/types/database.types";
import ProposalViewer from "@/components/proposal/ProposalViewer";
import ProposalActions from "@/components/proposal/ProposalActions";

export default function ProposalClientPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [proposal, setProposal] = useState<ProposalFromDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProposal() {
      try {
        const res = await fetch(`/api/proposals/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Proposta não encontrada");
          } else {
            throw new Error("Erro ao carregar proposta");
          }
          return;
        }
        const data = await res.json();
        setProposal(data.proposal);
      } catch (err) {
        console.error("Erro:", err);
        setError("Erro ao carregar proposta");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProposal();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-600 font-medium">Carregando proposta...</p>
        </div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-dark-800 mb-2">
            {error || "Proposta não encontrada"}
          </h1>
          <p className="text-dark-500 mb-6">
            A proposta que você está procurando não existe ou pode ter expirado.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    );
  }

  const isExpired = new Date(proposal.validUntil) < new Date();

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
