import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Sama CST — Plateforme de Supervision & Atelier Technologies Services',
  description:
    'Système de supervision des équipements biomédicaux et industriels, gestion des réceptions atelier, fiches de vie 360°, et maintenance préventive/curative pour Technologies Services.',
  keywords: ['Technologies Services', 'CST', 'Maintenance biomédicale', 'Supervision Parc', 'Atelier Sénégal', 'Fiche de Vie'],
  authors: [{ name: 'Technologies Services CST' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} h-full`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="h-full bg-slate-50 text-slate-900 font-sans flex flex-col">
        {children}
      </body>
    </html>
  );
}
