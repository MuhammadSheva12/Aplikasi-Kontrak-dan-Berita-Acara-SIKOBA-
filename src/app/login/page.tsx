"use client";
import { useState } from "react";
import Image from "next/image";
import { HiEye, HiEyeOff, HiLockClosed, HiUser } from "react-icons/hi";
import { useRouter } from "next/navigation";
import axios from "@/app/utils/axiosAuth";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const response = await axios.post("/login", { username, password });
      const { id, role, nama_pegawai, nama_teknis } = response.data;
      console.log("Login berhasil:", { id, role, nama_pegawai, nama_teknis });
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login gagal. Silakan coba lagi.";
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-screen h-screen flex overflow-hidden">
      {/* Background Gambar + Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/bps.jpg"
          alt="Login Background"
          fill
          priority
          quality={100}
          style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-0 bg-blue-950/70" />
      </div>

      {/* Spinner Loading Elegan */}
      {isSubmitting && (
        <div className="absolute z-50 inset-0 bg-black/40 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
          />
        </div>
      )}

      {/* Kotak Login */}
      <motion.div
        className="m-auto w-full max-w-sm px-6 z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="bg-gradient-to-t from-blue-950/40 to-white/40 to-[100%] backdrop-blur-md rounded-xl p-7 shadow-lg text-white">
          <div className="flex flex-col items-center mb-3">
            <Image
              src="/logo_bps.png"
              alt="Logo BPS"
              width={80}
              height={80}
              priority
            />
            <h2 className="text-xl font-semibold">BADAN PUSAT STATISTIK</h2>
            <p className="text-xl font-semibold">KOTA SUKABUMI</p>
            <h1 className="mt-9 text-2xl font-bold text-gray-100">SIKOBA</h1>
            <p className="text-xs text-gray-100 font-semibold">
              Aplikasi Pembuatan Surat Kontrak dan BAST
            </p>
          </div>

          {/* Tampilkan error jika login gagal */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 text-red-400 font-semibold text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Username */}
            <div className="relative">
              <HiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-md bg-white/20 placeholder-gray-200 text-gray-200 border border-white/40 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50"
                disabled={isSubmitting}
              />
            </div>

            {/* 🔑 Input Password */}
            <div className="relative mb-9">
              <HiLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-md bg-white/20 placeholder-gray-200 text-gray-200 border border-white/40 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50"
                disabled={isSubmitting}
              />
              <div
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <HiEyeOff className="text-gray-300" />
                ) : (
                  <HiEye className="text-gray-300" />
                )}
              </div>
            </div>

            {/* 🔘 Tombol Login */}
            <div className="flex justify-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className={`w-60 py-2.5 rounded-full font-bold transition ${
                  isSubmitting
                    ? "bg-blue-600 cursor-not-allowed text-white"
                    : "bg-white text-blue-900 hover:bg-gray-100"
                }`}
              >
                MASUK
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
