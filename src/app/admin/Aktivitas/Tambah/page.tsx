"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";
import axios from "@/app/utils/axiosAPI";
import { showError } from "@/app/utils/toast";

const aktivitasSchema = z.object({
  nama_aktivitas: z.string().min(1, "Nama aktivitas wajib diisi"),
});

type FormData = z.infer<typeof aktivitasSchema>;

export default function TambahAktivitas() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(aktivitasSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await axios.post("/aktivitas", data, { withCredentials: true });
      reset();
      router.push("/admin/Aktivitas?status=success&message=" +
          encodeURIComponent("Data berhasil ditambahkan!"));
    } catch (error: any) {
      const pesanError =
        error.response?.data?.message || "Gagal menambahkan data aktivitas.";
      showError(pesanError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 px-6 min-h-screen bg-white text-black">
      <h1 className="text-2xl font-bold text-blue-950 mb-4">Data Aktivitas</h1>
      <h2 className="inline-block bg-[#30387B] text-white px-5 py-2 rounded mb-10">
        Form Tambah Aktivitas
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-8 max-w-5xl">
          <Input
            label="Nama Aktivitas"
            placeholder="Isi nama aktivitas"
            {...register("nama_aktivitas")}
            error={errors.nama_aktivitas?.message}
          />
        </div>

        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-[#30387B] text-white px-8 py-2 rounded hover:bg-[#23255f] transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Menyimpan..." : "Simpan"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 text-black px-8 py-2 rounded hover:bg-gray-400 transition"
          >
            Kembali
          </button>
        </div>
      </form>
    </div>
  );
}

type InputProps = {
  label: string;
  placeholder: string;
  type?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({ label, placeholder, type = "text", error, ...rest }: InputProps) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        {...rest}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#30387B]"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
