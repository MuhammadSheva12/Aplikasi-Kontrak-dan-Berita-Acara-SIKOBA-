"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState, useEffect } from "react";
import axios from "@/app/utils/axiosAPI";

type Teknis = {
  id: number;
  nama_teknis: string;
  kode_teknis: string;
};

type Aktivitas = {
  id: number;
  nama_aktivitas: string;
};

type Survei = {
  id: number;
  nama_survei: string;
};

const schema = z.object({
  teknis_id: z.string().min(1, "Teknis wajib dipilih").transform(Number),
  survei_id: z.string().min(1, "Survei wajib dipilih").transform(Number),
  aktivitas_id: z.string().min(1, "Aktivitas wajib dipilih").transform(Number),
});

// Input = nilai dari form (string), Output = hasil setelah diproses zod (number)
type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

export default function TambahData() {
  const [isLoading, setIsLoading] = useState(false);
  const [teknisOptions, setTeknisOptions] = useState<Teknis[]>([]);
  const [surveiOptions, setSurveiOptions] = useState<Survei[]>([]);
  const [aktivitasOptions, setAktivitasOptions] = useState<Aktivitas[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      teknis_id: "",
      survei_id: "",
      aktivitas_id: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teknisRes, aktivitasRes, surveiRes] = await Promise.all([
          axios.get("/teknis"),
          axios.get("/aktivitas"),
          axios.get("/survei"),
        ]);

        setTeknisOptions(teknisRes.data?.data || []);
        setAktivitasOptions(aktivitasRes.data?.data || []);
        setSurveiOptions(surveiRes.data?.data || []);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: FormOutput) => {
    setIsLoading(true);
    try {
      await axios.post("/kegiatan", data, { withCredentials: true });
      reset();
      router.push(
        "/admin/Data_Kegiatan?status=success&message=" +
          encodeURIComponent("Data berhasil ditambahkan!")
      );
    } catch (error) {
      console.error("Error saat menambahkan data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 px-6 min-h-screen bg-white">
      <h1 className="text-2xl font-bold text-blue-950 mb-4">
        Data Kegiatan
      </h1>
      <h2 className="inline-block bg-[#30387B] text-white px-5 py-2 rounded mb-10">
        Form Tambah Data
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-8 max-w-5xl text-black">
          {/* Select Teknis */}
          <SelectField
            label="Teknis"
            options={teknisOptions.map((teknis) => ({
              value: teknis.id,
              label: `${teknis.nama_teknis} (${teknis.kode_teknis})`,
            }))}
            {...register("teknis_id")}
            error={errors.teknis_id?.message}
            disabled={isLoading}
          />

          {/* Select Survei */}
          <SelectField
            label="Nama Survei"
            options={surveiOptions.map((item) => ({
              value: item.id,
              label: item.nama_survei,
            }))}
            {...register("survei_id")}
            error={errors.survei_id?.message}
            disabled={isLoading}
          />

          {/* Select Aktivitas */}
          <SelectField
            label="Aktivitas"
            options={aktivitasOptions.map((item) => ({
              value: item.id,
              label: item.nama_aktivitas,
            }))}
            {...register("aktivitas_id")}
            error={errors.aktivitas_id?.message}
            disabled={isLoading}
          />
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

type SelectFieldProps = {
  label: string;
  options: { value: number; label: string }[];
  error?: string;
  disabled?: boolean;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, error, disabled, ...rest }, ref) => (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-700">
        {label}
      </label>
      <select
        {...rest}
        ref={ref}
        className="w-full px-4 py-2 border border-gray-300 rounded text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#30387B]"
        disabled={disabled}
      >
        <option value="" disabled hidden>
          Pilih {label.toLowerCase()}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  )
);
SelectField.displayName = "SelectField";