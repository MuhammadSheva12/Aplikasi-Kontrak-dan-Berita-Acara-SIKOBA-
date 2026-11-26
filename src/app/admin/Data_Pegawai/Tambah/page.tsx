"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { showError } from "@/app/utils/toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";
import axios from "@/app/utils/axiosAPI";

const pegawaiSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  jabatan: z.string().min(1, "Jabatan wajib diisi"),
  nip: z.string().min(1, "NIP wajib diisi"),
});

type FormData = z.infer<typeof pegawaiSchema>;

export default function TambahPegawai() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(pegawaiSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await axios.post("/pegawai", data, {});

      reset();
      router.push(
        "/admin/Data_Pegawai?status=success&message=" +
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
      <h1 className="text-2xl font-bold text-blue-950 mb-4">Data Pegawai</h1>

      <h2 className="inline-block bg-[#30387B] text-white px-5 py-2 rounded mb-10">
        Form Tambah Pegawai
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-8 max-w-5xl text-black">
          <div className="space-y-6">
            <Input
              label="Nama"
              placeholder="Isi nama pegawai"
              {...register("nama")}
              error={errors.nama?.message}
            />
          </div>

          <div className="space-y-6">
            <Input
              label="Jabatan"
              placeholder="Isi jabatan pegawai"
              {...register("jabatan")}
              error={errors.jabatan?.message}
            />
          </div>

          <div className="space-y-6 col-span-2 max-w-md">
            <Input
              label="NIP"
              placeholder="Isi NIP pegawai"
              {...register("nip")}
              error={errors.nip?.message}
            />
          </div>
        </div>

        <div className="mt-5 flex justify-items-end gap-4">
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

const Input = ({
  label,
  placeholder,
  type = "text",
  error,
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
        {...rest}
        className="w-full px-4 py-2 border border-gray-300 rounded"
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};
