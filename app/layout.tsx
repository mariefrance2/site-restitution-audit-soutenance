import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Audit de sécurité — Agent IA GLPI | Third SARL",
  description:
    "Restitution du mémoire de fin d'études : audit de sécurité, Red Teaming et remédiation d'un agent IA autonome d'affectation de tickets GLPI, réalisé au sein de Third SARL.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen bg-surface-soft font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
