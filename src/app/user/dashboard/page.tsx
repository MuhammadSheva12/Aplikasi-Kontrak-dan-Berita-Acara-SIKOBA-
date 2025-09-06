"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  return (
    <div className="relative min-h-screen p-6 text-white z-10 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bg2.png"
          alt="Background"
          fill
          priority
          quality={100}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-blue-950/60" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-3xl mx-auto mt-24 bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-8 shadow-xl"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <Image
            src="/logo_bps.png"
            alt="Logo BPS"
            width={100}
            height={90}
            className="animate-pulse"
          />

          <h1 className="text-3xl md:text-2xl font-bold text-white">
            Selamat Datang di SIKOBA
          </h1>
          <p className="text-lg text-gray-200">
            Aplikasi Pembuatan Kontrak dan Berita Acara Serah Terima Pekerjaan
          </p>
        </div>
      </motion.div>
    </div>
  );
}
