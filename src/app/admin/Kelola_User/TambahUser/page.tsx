"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { showError } from "@/app/utils/toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState, useEffect } from "react";
import axios from "@/app/utils/axiosAPI";
import { isAxiosError } from "axios";

type Teknis = {
  id: number;
  nama_teknis: string;
  kode_teknis: string;
};

type Pegawai = {
  id: number;
  nama: string;
  nip: string;
  jabatan: string;
};

const userSchema = z.object({
  nama_pegawai: z.string().min(1, "Pegawai wajib dipilih"),
  teknis: z.string().min(1, "Teknis wajib dipilih"),
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["admin", "user"], { required_error: "Role wajib dipilih" }),
});

type FormData = z.infer<typeof userSchema>;

export default function TambahUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [teknisOptions, setTeknisOptions] = useState<Teknis[]>([]);
  const [pegawaiOptions, setPegawaiOptions] = useState<Pegawai[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nama_pegawai: "",
      teknis: "",
      username: "",
      password: "",
      role: undefined,
    },
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [teknisRes, pegawaiRes] = await Promise.all([
          axios.get("/teknis"),
          axios.get("/pegawai"),
        ]);
        setTeknisOptions(teknisRes.data.data);
        setPegawaiOptions(pegawaiRes.data.data);
      } catch {
        showError("Gagal memuat data teknis/pegawai");
      }
    };

    fetchOptions();
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const selectedPegawai = pegawaiOptions.find(
        (p) => p.id.toString() === data.nama_pegawai,
      );

      const payload = {
        username: data.username,
        password: data.password,
        role: data.role,
        pegawai_id: Number(data.nama_pegawai),
        teknis_id: Number(data.teknis),
        nama: selectedPegawai?.nama || "",
      };

      await axios.post("/users", payload);
      reset({
        nama_pegawai: "",
        teknis: "",
        username: "",
        password: "",
        role: undefined,
      });
      router.push(
        "/admin/Kelola_User?status=success&message=" +
          encodeURIComponent("User berhasil ditambahkan!"),
      );
    } catch (error) {
  let msg = "Gagal menambahkan user";
  if (isAxiosError<{ message?: string; error?: string }>(error)) {
    msg = error.response?.data?.message || error.response?.data?.error || error.message || msg;
  } else if (error instanceof Error) {
    msg = error.message || msg;
  }
  showError(msg);
} finally {
  setIsLoading(false);
}
  };

  return (
    <div className="min-h-screen bg-white pt-28 px-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Data User</h1>
      <h2 className="inline-block bg-[#30387B] text-white px-5 py-2 rounded mb-6">
        Form Tambah User
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-8 max-w-5xl text-black">
          <div className="space-y-6">
            <SelectField
              label="Nama Pegawai"
              options={pegawaiOptions.map((p) => ({
                value: p.id.toString(),
                label: p.nama,
              }))}
              {...register("nama_pegawai")}
              error={errors.nama_pegawai?.message}
              disabled={isLoading}
            />

            <SelectField
              label="Teknis"
              options={teknisOptions.map((t) => ({
                value: t.id.toString(),
                label: `${t.nama_teknis} (${t.kode_teknis})`,
              }))}
              {...register("teknis")}
              error={errors.teknis?.message}
              disabled={isLoading}
            />

            <SelectField
              label="Role"
              defaultValue={""}
              options={[
                { value: "user", label: "User" },
                { value: "admin", label: "Admin" },
              ]}
              {...register("role")}
              error={errors.role?.message}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-6">
            <InputField
              label="Username"
              placeholder="Isi username"
              {...register("username")}
              error={errors.username?.message}
            />

            <InputField
              label="Password"
              type="password"
              placeholder="Isi password"
              {...register("password")}
              error={errors.password?.message}
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

// INPUT & SELECT

type InputFieldProps = {
  label: string;
  placeholder: string;
  type?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const InputField = ({
  label,
  placeholder,
  type = "text",
  error,
  ...rest
}: InputFieldProps) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      {...rest}
      className="w-full h-10 px-4 py-2 border border-gray-300 rounded"
    />
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
);

type SelectFieldProps = {
  label: string;
  options: { value: number | string; label: string }[];
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
        className="w-full h-10 px-4 py-2 border border-gray-300 rounded text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#30387B] max-h-60 overflow-auto"
        disabled={disabled}
      >
        <option value="" disabled hidden>
          Pilih {label.toLowerCase()}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  ),
);
SelectField.displayName = "SelectField";
