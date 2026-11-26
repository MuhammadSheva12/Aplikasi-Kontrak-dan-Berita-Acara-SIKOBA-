"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "@/app/utils/axiosAPI";
import { Handshake, Contact2, ReceiptText, Newspaper } from "lucide-react";
import SpinnerHalaman from "@/app/components/shared/SpinnerHalaman";


interface StatsData {
  pegawai: number;
  mitra: number;
  bast: number;
  kontrak: number;
}

export default function AdminDashboard() {
  const [dataCount, setDataCount] = useState<StatsData>({
    pegawai: 1,
    mitra: 1,
    bast: 1,
    kontrak: 1,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [pegawaiRes, mitraRes, bastRes, kontrakRes] = await Promise.all([
          axios.get("/pegawai/count", { withCredentials: true }),
          axios.get("/mitra/count", { withCredentials: true }),
          axios.get("/bast/count", { withCredentials: true }),
          axios.get("/kontrak/count", { withCredentials: true }),
        ]);

        setDataCount({
          pegawai: pegawaiRes.data.jumlah || 0,
          mitra: mitraRes.data.jumlah || 0,
          bast: bastRes.data.jumlah || 0,
          kontrak: kontrakRes.data.jumlah || 0,
        });
      } catch (err) {
        console.error("Gagal mengambil data jumlah:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const stats = [
    { key: "Pegawai", icon: <Contact2 size={40} />, jumlah: dataCount.pegawai },
    { key: "Mitra", icon: <Handshake size={40} />, jumlah: dataCount.mitra },
    { key: "BAST", icon: <Newspaper size={40} />, jumlah: dataCount.bast },
    { key: "Kontrak", icon: <ReceiptText size={40} />, jumlah: dataCount.kontrak },
  ];

  return (
    <div className="relative min-h-screen p-6 text-white z-10">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bg2.png"
          alt="Background"
          fill
          priority
          quality={100}
          style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-0 bg-blue-950/40" />
      </div>

      {/* Judul Halaman */}
      <div className="relative z-10 flex flex-col items-center mt-25 text-center">
        <h1 className="text-3xl font-bold">SELAMAT DATANG DI SIKOBA</h1>
        <p className="text-lg mt-2">
          Aplikasi Pembuatan Kontrak dan Berita Acara Serah Terima Pekerjaan
        </p>
      </div>

      {/* Konten Utama */}
      <main className="mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mx-auto max-w-7xl">
          {stats.map(({ key, icon, jumlah }) => (
            <div
              key={key}
              className="bg-white/90 rounded-xl shadow-xl p-6 flex flex-col items-center text-center text-blue-950 hover:scale-[1.02] transition duration-300 ease-in-out"
            >
              <div className="mb-4 text-blue-800">{icon}</div>
              <h3 className="text-base font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                {key}
              </h3>
              <p className="text-4xl font-bold text-[#d32f2f]">
                {loading ? "-" : jumlah}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
