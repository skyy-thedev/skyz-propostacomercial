// ============================================
// ADMIN DASHBOARD - V4
// Proposals list with filters, stats, actions
// ============================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { getServiceById } from "@/lib/config/services";
import { COMPANY_INFO } from "@/lib/config/company-content";

interface Proposal {
  id: string;
  proposalNumber: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string | null;
  category: string;
  mainService: string;
  status: string;
  viewCount: number;
  createdAt: string;
  validUntil: string;
  emailSentAt: string | null;
  lastViewedAt: string | null;
  price: number;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  DRAFT: { label: "Rascunho", color: "text-slate-400", bg: "bg-slate-800" },
  SENT: { label: "Enviada", color: "text-blue-400", bg: "bg-blue-950" },
  VIEWED: { label: "Visualizada", color: "text-amber-400", bg: "bg-amber-950" },
  ACCEPTED: { label: "Aceita", color: "text-green-400", bg: "bg-green-950" },
  REJECTED: { label: "Rejeitada", color: "text-red-400", bg: "bg-red-950" },
  EXPIRED: { label: "Expirada", color: "text-slate-500", bg: "bg-slate-900" },
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(date));
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}min atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d atrás`;
  return formatDate(date);
}

export default function AdminPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [page, setPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchProposals = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (searchDebounced) params.set("search", searchDebounced);
      params.set("page", page.toString());
      params.set("limit", "15");

      const res = await fetch(`/api/admin/proposals?${params}`);
      const data = await res.json();

      setProposals(data.proposals || []);
      setPagination(data.pagination || null);
      setStats(data.stats || {});
    } catch (err) {
      console.error("Erro ao carregar propostas:", err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, searchDebounced, page]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  // Reset page when filter/search changes
  useEffect(() => {
    setPage(1);
  }, [filterStatus, searchDebounced]);

  const totalProposals = Object.values(stats).reduce((a, b) => a + b, 0);
  const totalRevenue = proposals.reduce((sum, p) => {
    if (p.status === "ACCEPTED") return sum + p.price;
    return sum;
  }, 0);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard
          label="Total"
          value={totalProposals}
          color="text-white"
        />
        <StatCard
          label="Enviadas"
          value={stats.SENT || 0}
          color="text-blue-400"
        />
        <StatCard
          label="Visualizadas"
          value={stats.VIEWED || 0}
          color="text-amber-400"
        />
        <StatCard
          label="Aceitas"
          value={stats.ACCEPTED || 0}
          color="text-green-400"
        />
        <StatCard
          label="Rejeitadas"
          value={stats.REJECTED || 0}
          color="text-red-400"
        />
        <StatCard
          label="Expiradas"
          value={stats.EXPIRED || 0}
          color="text-slate-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nome, email, empresa ou número..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "SENT", "VIEWED", "ACCEPTED", "REJECTED", "EXPIRED"].map(
            (s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  filterStatus === s
                    ? "bg-blue-600 text-white"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {s === "all"
                  ? "Todas"
                  : STATUS_CONFIG[s]?.label || s}
              </button>
            )
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">
              Nenhuma proposta encontrada
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Proposta
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">
                    Serviço
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                    Valor
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                    Views
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                    Criada
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {proposals.map((proposal, idx) => {
                  const service = getServiceById(proposal.mainService);
                  const statusConf =
                    STATUS_CONFIG[proposal.status] || STATUS_CONFIG.DRAFT;
                  const proposalUrl = `${baseUrl}/proposta/${proposal.id}`;

                  return (
                    <motion.tr
                      key={proposal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono text-slate-300">
                          {proposal.proposalNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {proposal.clientName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {proposal.clientCompany || proposal.clientEmail}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-sm text-slate-400">
                          {service?.name || proposal.mainService}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-sm font-medium text-blue-400">
                          {proposal.price > 0
                            ? formatCurrency(proposal.price)
                            : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusConf.color} ${statusConf.bg}`}
                        >
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <span className="text-sm text-slate-400">
                          {proposal.viewCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-slate-500">
                          {timeAgo(proposal.createdAt)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <a
                            href={proposalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            title="Ver proposta"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </a>
                          <a
                            href={`/api/proposals/${proposal.id}/pdf`}
                            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors"
                            title="Download PDF"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                              <line x1="12" y1="18" x2="12" y2="12" />
                              <polyline points="9 15 12 18 15 15" />
                            </svg>
                          </a>
                          <button
                            onClick={() => {
                              const whatsappUrl = `https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(
                                `Olá! Sobre a proposta ${proposal.proposalNumber} para ${proposal.clientName}: ${proposalUrl}`
                              )}`;
                              window.open(whatsappUrl, "_blank");
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-green-400 transition-colors"
                            title="WhatsApp"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800">
            <p className="text-xs text-slate-500">
              {pagination.total} proposta{pagination.total !== 1 ? "s" : ""} no total
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <span className="px-3 py-1.5 text-xs text-slate-400">
                {page} / {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page === pagination.totalPages}
                className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
