"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileText,
  Link2,
  Mail,
  Check,
  Printer,
  Share2,
  X,
} from "lucide-react";

interface ProposalActionsProps {
  proposalId: string;
  proposalNumber: string;
  isExpired: boolean;
}

export default function ProposalActions({
  proposalId,
  proposalNumber,
  isExpired,
}: ProposalActionsProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState<"pdf" | "docx" | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const proposalUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/proposta/${proposalId}`
      : "";

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(proposalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (format: "pdf" | "docx") => {
    setDownloading(format);

    try {
      const res = await fetch(`/api/proposals/${proposalId}/${format}`);

      if (!res.ok) throw new Error("Erro ao gerar arquivo");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `proposta-${proposalNumber}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Erro ao baixar:", error);
      alert("Erro ao gerar arquivo. Tente novamente.");
    } finally {
      setDownloading(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Proposta Comercial - ${proposalNumber}`);
    const body = encodeURIComponent(
      `Olá!\n\nSegue o link para visualizar a proposta comercial:\n${proposalUrl}\n\nAtenciosamente,\nSkyz Design BR`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Olá! Segue o link para visualizar a proposta comercial: ${proposalUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-dark-200 shadow-sm print:hidden">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 max-w-6xl">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">SKZ</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-semibold text-dark-800">Skyz Design BR</span>
            <span className="text-dark-400 text-sm ml-2">
              #{proposalNumber}
            </span>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Copiar Link */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-3 py-2 bg-dark-100 hover:bg-dark-200 rounded-lg transition-colors text-sm font-medium"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-success" />
                <span className="text-success hidden sm:inline">Copiado!</span>
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4" />
                <span className="hidden sm:inline">Copiar Link</span>
              </>
            )}
          </motion.button>

          {/* Compartilhar */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-dark-100 hover:bg-dark-200 rounded-lg transition-colors text-sm font-medium"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Compartilhar</span>
            </motion.button>

            <AnimatePresence>
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-dark-200 py-2 z-50"
                >
                  <button
                    onClick={() => {
                      handleEmailShare();
                      setShowShareMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-dark-50 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-dark-500" />
                    <span className="text-sm">Enviar por E-mail</span>
                  </button>
                  <button
                    onClick={() => {
                      handleWhatsAppShare();
                      setShowShareMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-dark-50 transition-colors"
                  >
                    <span className="text-lg">📱</span>
                    <span className="text-sm">Enviar via WhatsApp</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Imprimir */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-2 bg-dark-100 hover:bg-dark-200 rounded-lg transition-colors text-sm font-medium"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimir</span>
          </motion.button>

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 bg-dark-200" />

          {/* Baixar PDF */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDownload("pdf")}
            disabled={downloading === "pdf"}
            className="flex items-center gap-2 px-4 py-2 bg-error hover:bg-error/90 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading === "pdf" ? "Gerando..." : "PDF"}</span>
          </motion.button>

          {/* Baixar DOCX */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDownload("docx")}
            disabled={downloading === "docx"}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            <span>{downloading === "docx" ? "Gerando..." : "DOCX"}</span>
          </motion.button>
        </div>
      </div>

      {/* Banner de expiração */}
      {isExpired && (
        <div className="bg-warning/20 border-t border-warning/30 px-4 py-2">
          <p className="text-center text-sm text-warning font-medium">
            ⚠️ Esta proposta expirou. Entre em contato para renovação.
          </p>
        </div>
      )}
    </div>
  );
}
