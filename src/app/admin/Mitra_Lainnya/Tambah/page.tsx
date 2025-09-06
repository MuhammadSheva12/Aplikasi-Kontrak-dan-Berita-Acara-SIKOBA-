"use client";

import React, { useState, useEffect } from "react"; // import useEffect
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/app/utils/axiosAPI";
import { useRouter } from "next/navigation";
import { showError, showSuccess } from "@/app/utils/toast";

const mitraSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  nik: z
    .string()
    .min(16, "NIK harus terdiri dari 16 digit")
    .max(16, "NIK harus terdiri dari 16 digit")
    .regex(/^\d+$/, "NIK harus berupa angka"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  pekerjaan: z.string().min(1, "Pekerjaan wajib diisi"),
});

type FormData = z.infer<typeof mitraSchema>;

export default function TambahMitraLainnya() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(mitraSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await axios.post("/mitra/lainnya", data, {
      });

      reset();
      showSuccess("Data berhasil ditambahkan!");
      router.push(
        "/admin/Mitra_Lainnya?success&message=" +
          encodeURIComponent("Data berhasil ditambahkan!")
      );
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Gagal menambahkan mitra";
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-28 px-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Data Mitra Lainnya
      </h1>
      <h2 className="inline-block bg-[#30387B] text-white px-5 py-2 rounded mb-6">
        Form Data Mitra Lainnya
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-8 max-w-4xl text-black">
          <div className="space-y-6">
            <Input
              label="Nama"
              placeholder="Masukkan nama mitra"
              {...register("nama")}
              error={errors.nama?.message}
            />
            <Input
              label="NIK"
              placeholder="Masukkan NIK (16 digit)"
              {...register("nik")}
              error={errors.nik?.message}
            />
          </div>
          <div className="space-y-6">
            <Input
              label="Alamat"
              placeholder="Masukkan alamat"
              {...register("alamat")}
              error={errors.alamat?.message}
            />
            <Input
              label="Pekerjaan"
              placeholder="Masukkan pekerjaan"
              {...register("pekerjaan")}
              error={errors.pekerjaan?.message}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-4">
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

// Komponen Input tetap sama
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
