import type { Metadata } from "next";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import "./globals.css";
import Analytics from "@/components/analytics";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://rural.grupojung.com.br",
  ),
  title: "Diagnóstico Fiscal Rural 2026 | Grupo Jung",
  description:
    "Descubra como está a situação fiscal da sua atividade rural em 2026 e evite surpresas no Imposto de Renda de 2027.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Seu Imposto de Renda Rural de 2027 já começou.",
    description:
      "Faça seu Diagnóstico Fiscal Rural 2026 com o Grupo Jung. Leva menos de 2 minutos.",
    locale: "pt_BR",
    type: "website",
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <Analytics />
        {children}
        <VercelAnalytics />
      </body>
    </html>
  );
}
