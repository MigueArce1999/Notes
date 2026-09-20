import type { Metadata } from "next";
import "./globals.css";
import {assetPath} from '@/lib/note-client';

export const metadata: Metadata = {
  title: "Nöte — Crea tu propia esencia",
  description: "Descubre una esencia tan única como tú. Tres pasos para encontrar tu universo olfativo.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: assetPath('/favicon.svg'),
    shortcut: assetPath('/favicon.svg'),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
