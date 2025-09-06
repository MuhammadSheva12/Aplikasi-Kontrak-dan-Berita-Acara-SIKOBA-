// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SIKOBA - Aplikasi Kontrak dan BAST',
  description: 'Aplikasi Pembuatan Kontrak dan Berita Acara Serah Terima Pekerjaan di BPS Kota Sukabumi',
    icons: {
    icon: '/logo_bps.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
