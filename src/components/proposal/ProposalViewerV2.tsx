"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  Package,
  ArrowRight,
  Star,
  Shield,
  Sparkles,
  MessageSquare,
  Send,
} from "lucide-react";
import { formatPrice } from "@/lib/generators/recommendationEngine";
import { COMPANY_INFO } from "@/lib/config/company-content";
import { getServiceById } from "@/lib/config/services";

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

interface ProposalData {
  id: string;
  proposalNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientCompany?: string;
  clientSegment?: string;
  mainService: string;
  category: string;
  serviceOption?: string;
  challenges: string[];
  timeline: string;
  hasBranding?: string;
  budget: string;
  deliveryMethod: string[];
  wantsMeeting: boolean;
  observations?: string;
  recommendedPackage: PackageData | null;
  alternativePackages: PackageData[];
  combos: PackageData[];
  createdAt: string;
  validUntil: string;
  status: string;
  viewCount: number;
}

interface ProposalViewerV2Props {
  proposal: ProposalData;
  isExpired: boolean;
}

const CHALLENGE_LABELS: Record<string, string> = {
  visibility: "Aumentar visibilidade online",
  sales: "Gerar mais vendas",
  branding: "Fortalecer a marca",
  engagement: "Aumentar engajamento",
  presence: "Criar presença digital",
  conversion: "Melhorar conversão",
};

const TIMELINE_LABELS: Record<string, string> = {
  urgente: "Entrega Urgente",
  normal: "Prazo Normal",
  flexivel: "Prazo Flexível",
};

export default function ProposalViewerV2({
  proposal,
  isExpired,
}: ProposalViewerV2Props) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const service = getServiceById(proposal.mainService);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Registrar visualização
  useEffect(() => {
    fetch(`/api/proposals/${proposal.id}/track`, { method: "POST" }).catch(
      console.error
    );
  }, [proposal.id]);

  const handleSelectPackage = async (packageId: string) => {
    setSelectedPackage(packageId);
    
    // Atualizar no banco
    try {
      await fetch(`/api/proposals/${proposal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "ACCEPTED",
          selectedPackage: packageId,
        }),
      });
    } catch (error) {
      console.error("Erro ao selecionar pacote:", error);
    }
  };

  const allPackages = [
    ...(proposal.recommendedPackage ? [proposal.recommendedPackage] : []),
    ...proposal.alternativePackages,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header/Cover */}
      <div className="relative bg-gradient-to-br from-primary via-secondary to-accent text-white">
        <div className="absolute inset-0 bg-black/10" />
        
        <div className="relative max-w-5xl mx-auto px-6 py-16 text-center">
          {isExpired && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
            >
              Proposta Expirada
            </motion.div>
          )}

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-xl">
              <span className="text-primary font-bold text-2xl">SKYZ</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold mb-3"
          >
            Proposta Comercial
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl font-light mb-2 opacity-90"
          >
            {proposal.clientName}
            {proposal.clientCompany && ` • ${proposal.clientCompany}`}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm opacity-75 mb-6"
          >
            Nº {proposal.proposalNumber}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 text-sm"
          >
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Calendar className="w-4 h-4" />
              <span>Criada: {formatDate(proposal.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Clock className="w-4 h-4" />
              <span>Válida até: {formatDate(proposal.validUntil)}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Resumo do Serviço */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-dark-800 mb-6 flex items-center gap-3">
            <Package className="w-7 h-7 text-primary" />
            Serviço Solicitado
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-dark-500 mb-1">Serviço Principal</p>
              <p className="text-lg font-semibold text-dark-800">
                {service?.name || proposal.mainService}
              </p>
            </div>

            <div>
              <p className="text-sm text-dark-500 mb-1">Categoria</p>
              <p className="text-lg font-semibold text-dark-800">
                {proposal.category === "design"
                  ? "🎨 Design & Social Media"
                  : "💻 Desenvolvimento Web"}
              </p>
            </div>

            <div>
              <p className="text-sm text-dark-500 mb-1">Prazo Desejado</p>
              <p className="text-lg font-semibold text-dark-800">
                {TIMELINE_LABELS[proposal.timeline] || proposal.timeline}
              </p>
            </div>

            {proposal.clientSegment && (
              <div>
                <p className="text-sm text-dark-500 mb-1">Segmento</p>
                <p className="text-lg font-semibold text-dark-800">
                  {proposal.clientSegment}
                </p>
              </div>
            )}
          </div>

          {/* Desafios */}
          {proposal.challenges.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-dark-500 mb-3">Objetivos Identificados</p>
              <div className="flex flex-wrap gap-2">
                {proposal.challenges.map((challenge) => (
                  <span
                    key={challenge}
                    className="bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {CHALLENGE_LABELS[challenge] || challenge}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.section>

        {/* Pacote Recomendado */}
        {proposal.recommendedPackage && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-dark-800 mb-6 flex items-center gap-3">
              <Star className="w-7 h-7 text-secondary" />
              Recomendação para Você
            </h2>

            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-1">
              <div className="bg-white rounded-xl p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full">
                      ⭐ RECOMENDADO
                    </span>
                    <h3 className="text-2xl font-bold text-dark-800 mt-3">
                      {proposal.recommendedPackage.name}
                    </h3>
                    <p className="text-dark-500 mt-1">
                      {proposal.recommendedPackage.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">
                      {formatPrice(proposal.recommendedPackage.price)}
                    </p>
                    <p className="text-sm text-dark-500">
                      {proposal.recommendedPackage.deliveryTime}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-semibold text-dark-700 mb-3">Inclui:</h4>
                    <ul className="space-y-2">
                      {proposal.recommendedPackage.includes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-dark-600">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark-700 mb-3">Benefícios:</h4>
                    <ul className="space-y-2">
                      {proposal.recommendedPackage.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-dark-600">
                          <Sparkles className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectPackage(proposal.recommendedPackage!.id)}
                  disabled={isExpired || selectedPackage !== null}
                  className={`w-full mt-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                    selectedPackage === proposal.recommendedPackage.id
                      ? "bg-green-500 text-white"
                      : isExpired || selectedPackage
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg"
                  }`}
                >
                  {selectedPackage === proposal.recommendedPackage.id ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Pacote Selecionado!
                    </>
                  ) : (
                    <>
                      Escolher Este Pacote
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {/* Combos */}
        {proposal.combos.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-dark-800 mb-6 flex items-center gap-3">
              <Shield className="w-7 h-7 text-accent" />
              Combos Especiais
              <span className="text-sm font-normal text-dark-500 ml-2">
                Economize com pacotes combinados
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {proposal.combos.map((combo) => (
                <div
                  key={combo.id}
                  className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-accent transition-all"
                >
                  {combo.tag && (
                    <span className="bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-full">
                      {combo.tag}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-dark-800 mt-3 mb-2">
                    {combo.name}
                  </h3>
                  <p className="text-dark-500 text-sm mb-4">{combo.description}</p>

                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(combo.price)}
                    </span>
                    {combo.originalPrice && (
                      <>
                        <span className="text-lg text-dark-400 line-through">
                          {formatPrice(combo.originalPrice)}
                        </span>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                          -{combo.discount}%
                        </span>
                      </>
                    )}
                  </div>

                  <ul className="space-y-1 mb-4">
                    {combo.benefits.slice(0, 3).map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-dark-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPackage(combo.id)}
                    disabled={isExpired || selectedPackage !== null}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      selectedPackage === combo.id
                        ? "bg-green-500 text-white"
                        : isExpired || selectedPackage
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-accent/10 text-accent hover:bg-accent hover:text-white"
                    }`}
                  >
                    {selectedPackage === combo.id ? "Selecionado!" : "Escolher Combo"}
                  </button>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Alternativas */}
        {proposal.alternativePackages.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-dark-800 mb-6">
              Outras Opções
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              {proposal.alternativePackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition-all"
                >
                  {pkg.tag && (
                    <span className="bg-gray-100 text-dark-600 text-xs font-medium px-2 py-1 rounded-full">
                      {pkg.tag}
                    </span>
                  )}
                  <h3 className="font-bold text-dark-800 mt-2 mb-1">{pkg.name}</h3>
                  <p className="text-xl font-bold text-primary mb-3">
                    {formatPrice(pkg.price)}
                  </p>
                  <p className="text-sm text-dark-500 mb-4">{pkg.deliveryTime}</p>

                  <button
                    onClick={() => handleSelectPackage(pkg.id)}
                    disabled={isExpired || selectedPackage !== null}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedPackage === pkg.id
                        ? "bg-green-500 text-white"
                        : isExpired || selectedPackage
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-primary-50 text-primary hover:bg-primary hover:text-white"
                    }`}
                  >
                    {selectedPackage === pkg.id ? "Selecionado!" : "Escolher"}
                  </button>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Contato / CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-3">Vamos Conversar?</h2>
          <p className="opacity-90 mb-6">
            {proposal.wantsMeeting
              ? "Você indicou interesse em uma reunião. Vamos agendar!"
              : "Ficou com alguma dúvida? Estamos à disposição."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`https://wa.me/${COMPANY_INFO.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              WhatsApp
            </a>
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all"
            >
              <Mail className="w-5 h-5" />
              E-mail
            </a>
          </div>
        </motion.section>

        {/* Footer */}
        <div className="text-center text-sm text-dark-400 pt-8 border-t border-gray-100">
          <p>
            © {new Date().getFullYear()} {COMPANY_INFO.name}. Todos os direitos reservados.
          </p>
          <p className="mt-1">
            {COMPANY_INFO.instagram} • {COMPANY_INFO.email}
          </p>
        </div>
      </div>
    </div>
  );
}
