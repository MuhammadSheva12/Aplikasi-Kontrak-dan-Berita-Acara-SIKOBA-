"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/app/utils/axiosAPI";
import { showError, showSuccess } from "@/app/utils/toast";

interface Option {
  id: number;
  nama?: string;
  nama_jabatan?: string;
  nama_survei?: string;
  nama_teknis?: string;
  judul_template?: string;
}

interface FormKontrak {
  template_id: string;
  id_pegawai: string;
  id_jabatan: string;
  id_survei: string;
  id_teknis: string;
  honor: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  survei_besar?: string;
  alamat?: string;
}

export default function TambahKontrak() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [pegawai, setPegawai] = useState<Option[]>([]);
  const [jabatan, setJabatan] = useState<Option[]>([]);
  const [survei, setSurvei] = useState<Option[]>([]);
  const [teknis, setTeknis] = useState<Option[]>([]);
  const [templates, setTemplates] = useState<Option[]>([]);

  const [formData, setFormData] = useState<FormKontrak>({
    template_id: "",
    id_pegawai: "",
    id_jabatan: "",
    id_survei: "",
    id_teknis: "",
    honor: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    survei_besar: "",
    alamat: "",
  });

  useEffect(() => {
    Promise.all([
      axios.get("/public/pegawai"),
      axios.get("/public/jabatan"),
      axios.get("/public/survei"),
      axios.get("/public/teknis"),
      axios.get("/public/template"),
    ])
      .then(([p, j, s, t, tm]) => {
        setPegawai(p.data.data || []);
        setJabatan(j.data.data || []);
        setSurvei(s.data.data || []);
        setTeknis(t.data.data || []);
        setTemplates(tm.data.data || []);
      })
      .catch(() => showError("Gagal memuat data"));
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // ============================
  // HANDLE SUBMIT: SIMPAN SAJA (TANPA DOWNLOAD)
  // ============================
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Ganti dari /kontrak/generate ke /kontrak/save
      const res = await axios.post("/kontrak/save", formData);

      if (res.data.success) {
        showSuccess(res.data.message || "Kontrak berhasil disimpan");
        router.push("/user/data_kontrak");
      } else {
        showError(res.data.message || "Gagal menyimpan kontrak");
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err, "Gagal menyimpan kontrak");
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================
  // HANDLE SUBMIT AND DOWNLOAD: SIMPAN + LANGSUNG DOWNLOAD
  // ============================
  const handleSubmitAndDownload = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Menggunakan endpoint lama /kontrak/generate yang langsung download
      const res = await axios.post("/kontrak/generate", formData, {
        responseType: "blob",
      });

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);

      const disposition = res.headers["content-disposition"];
      let fileName = "kontrak.docx";
      if (disposition) {
        const match = disposition.match(/filename="(.+)"/);
        if (match?.[1]) fileName = match[1];
      }

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();

      window.URL.revokeObjectURL(url);

      showSuccess("Kontrak berhasil disimpan dan didownload");
      router.push("/user/data_kontrak");
    } catch (err) {
      const errorMessage = getErrorMessage(err, "Gagal menyimpan kontrak");
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 px-6 min-h-screen bg-white">
      <h1 className="text-2xl font-bold text-blue-950 mb-4">Simpan</h1>
      <h2 className="inline-block bg-[#30387B] text-white px-5 py-2 rounded mb-10">
        Form Kontrak
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-8 max-w-5xl text-black"
      >
        <div className="space-y-6">
          <SelectField
            label="Template"
            options={templates.map((t) => ({
              value: t.id.toString(),
              label: t.judul_template || "",
            }))}
            name="template_id"
            value={formData.template_id}
            onChange={handleChange}
            disabled={isLoading}
          />
          <SelectField
            label="Pegawai"
            options={pegawai.map((p) => ({
              value: p.id.toString(),
              label: p.nama || "",
            }))}
            name="id_pegawai"
            value={formData.id_pegawai}
            onChange={handleChange}
            disabled={isLoading}
          />
          <SelectField
            label="Jabatan"
            options={jabatan.map((j) => ({
              value: j.id.toString(),
              label: j.nama_jabatan || "",
            }))}
            name="id_jabatan"
            value={formData.id_jabatan}
            onChange={handleChange}
            disabled={isLoading}
          />
          <SelectField
            label="Survei"
            options={survei.map((s) => ({
              value: s.id.toString(),
              label: s.nama_survei || "",
            }))}
            name="id_survei"
            value={formData.id_survei}
            onChange={handleChange}
            disabled={isLoading}
          />
          <SelectField
            label="Teknis"
            options={teknis.map((t) => ({
              value: t.id.toString(),
              label: t.nama_teknis || "",
            }))}
            name="id_teknis"
            value={formData.id_teknis}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-6">
          <InputField
            label="Honor"
            placeholder="Isi honor"
            name="honor"
            value={formData.honor}
            onChange={handleChange}
          />
          <InputField
            label="Tanggal Mulai"
            type="date"
            name="tanggal_mulai"
            value={formData.tanggal_mulai}
            onChange={handleChange}
          />
          <InputField
            label="Tanggal Selesai"
            type="date"
            name="tanggal_selesai"
            value={formData.tanggal_selesai}
            onChange={handleChange}
          />
          <InputField
            label="Survei Besar (opsional)"
            placeholder="Isi survei besar"
            name="survei_besar"
            value={formData.survei_besar}
            onChange={handleChange}
          />
          <InputField
            label="Alamat"
            placeholder="Isi alamat pegawai"
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
          />
        </div>

        <div className="col-span-2 mt-5 flex gap-4">
          {/* BUTTON SIMPAN SAJA (TANPA DOWNLOAD) */}
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-[#30387B] text-white px-8 py-2 rounded hover:bg-[#23255f] transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Menyimpan..." : "Simpan Kontrak"}
          </button>

          {/* BUTTON SIMPAN + DOWNLOAD */}
          <button
            type="button"
            onClick={handleSubmitAndDownload}
            disabled={isLoading}
            className={`bg-green-600 text-white px-8 py-2 rounded hover:bg-green-700 transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Memproses..." : "Simpan & Download"}
          </button>

          {/* BUTTON KEMBALI */}
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
            className="bg-gray-300 text-black px-8 py-2 rounded hover:bg-gray-400 transition-colors"
          >
            Kembali
          </button>
        </div>
      </form>
    </div>
  );
}

// ======================
// INPUT FIELD
// ======================
const InputField = ({ label, placeholder, type = "text", ...rest }: any) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      {...rest}
      className="w-full h-10 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#30387B]"
    />
  </div>
);

// ======================
// SELECT FIELD
// ======================
const SelectField = ({
  label,
  options,
  value,
  name,
  onChange,
  disabled,
}: any) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full h-10 px-4 py-2 border border-gray-300 rounded text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#30387B] max-h-60 overflow-auto"
    >
      <option value="" disabled hidden>
        Pilih {label.toLowerCase()}
      </option>
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
