"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { showError } from "@/app/utils/toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState, useEffect } from "react";
import axios from "@/app/utils/axiosAPI";

const teknisSchema = z.object({
  nama_teknis: z.string().min(1, "Nama teknis wajib diisi"),
  kode_teknis: z.string().min(1, "Kode teknis wajib diisi"),
});

type FormData = z.infer<typeof teknisSchema>;

export default function TambahTeknis() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(teknisSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await axios.post("/teknis", data, {});

      reset();
      router.push(
        "/admin/Data_Teknis?status=success&message=" +
          encodeURIComponent("Data berhasil ditambahkan!"),
      );
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Gagal menambahkan data";
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 px-6 min-h-screen bg-white">
      <h1 className="text-2xl font-bold text-blue-950 mb-4">Data Teknis</h1>

      <h2 className="inline-block bg-[#30387B] text-white px-5 py-2 rounded mb-10">
        Form Tambah Data
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-8 max-w-5xl text-black">
          <div className="space-y-6">
            <Input
              label="Nama Teknis"
              placeholder="Isi nama teknis"
              {...register("nama_teknis")}
              error={errors.nama_teknis?.message}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-6">
            <Input
              label="Kode Teknis"
              placeholder="Isi kode teknis"
              {...register("kode_teknis")}
              error={errors.kode_teknis?.message}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="mt-5 flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-[#30387B] text-white px-8 py-2 rounded hover:bg-[#23255f] ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Menyimpan..." : "Simpan"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 text-black px-8 py-2 rounded hover:bg-gray-400"
            disabled={isLoading}
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
  disabled?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({
  label,
  placeholder,
  type = "text",
  error,
  disabled = false,
  ...rest
}: InputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-700">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...rest}
        className={`w-full px-4 py-2 border rounded ${
          error
            ? "border-red-600 focus:border-red-600"
            : "border-gray-300 focus:border-blue-500"
        }`}
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};
