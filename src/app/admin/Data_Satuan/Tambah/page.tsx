"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { showError, showSuccess } from "@/app/utils/toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";
import axios from "@/app/utils/axiosAPI";

const satuanSchema = z.object({
  uraian: z.string().min(1, "Uraian wajib diisi"),
  status: z.string().min(1, "Status wajib diisi"),
});

type FormData = z.infer<typeof satuanSchema>;

export default function TambahSatuan() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(satuanSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await axios.post("/satuan", data);

      reset();
      showSuccess("Data satuan berhasil ditambahkan!");
      router.push("/admin/Data_Satuan");
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Gagal menambahkan data satuan";
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 px-6 min-h-screen bg-white">
      <h1 className="text-2xl font-bold text-blue-950 mb-4">
        Data Satuan
      </h1>

      <h2 className="inline-block bg-[#30387B] text-white px-5 py-2 rounded mb-10">
        Form Tambah Data Satuan
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-8 max-w-5xl text-black">
          <div className="space-y-6">
            <Input
              label="Uraian"
              placeholder="Isi uraian"
              {...register("uraian")}
              error={errors.uraian?.message}
            />
            <Input
              label="Status"
              placeholder="Isi status"
              {...register("status")}
              error={errors.status?.message}
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
