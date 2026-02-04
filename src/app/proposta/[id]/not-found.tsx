"use client";

import Link from "next/link";
import { FileQuestion, Home, RefreshCw } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
          <FileQuestion className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-4xl font-bold text-dark-800 mb-4">
          Proposta não encontrada
        </h1>

        <p className="text-dark-500 mb-8">
          A proposta que você está procurando não existe, foi removida ou o link
          está incorreto.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <Home className="w-5 h-5" />
            Criar Nova Proposta
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 bg-dark-100 text-dark-700 px-6 py-3 rounded-xl font-semibold hover:bg-dark-200 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Tentar Novamente
          </button>
        </div>

        <p className="mt-8 text-sm text-dark-400">
          Se você acredita que isso é um erro, entre em contato conosco.
        </p>
      </div>
    </div>
  );
}
