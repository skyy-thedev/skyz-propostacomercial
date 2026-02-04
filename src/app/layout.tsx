import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Proposta Comercial | Skyz Design BR",
  description:
    "Sistema de automação de propostas comerciais personalizadas da Skyz Design BR. Crie propostas profissionais em PDF e DOCX.",
  keywords: [
    "proposta comercial",
    "skyz design",
    "design",
    "desenvolvimento",
    "software",
    "web",
    "aplicativo",
  ],
  authors: [{ name: "Skyz Design BR", url: "https://instagram.com/skyzdesignbr" }],
  openGraph: {
    title: "Proposta Comercial | Skyz Design BR",
    description: "Crie propostas comerciais personalizadas e profissionais",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
