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
  judul_template?: string;
  uraian?: string;
}

interface FormBast {
  template_id: string;
  id_pegawai: string;
  id_jabatan: string;
  id_survei: string;
  tanggal_bast: string;

  realisasi: string;
  target: string;
  satuan: string;
  bentuk: string;
  alamat: string;
  catatan: string;
}

export default function TambahBastPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [pegawai, setPegawai] = useState<Option[]>([]);
  const [jabatan, setJabatan] = useState<Option[]>([]);
  const [survei, setSurvei] = useState<Option[]>([]);
  const [templates, setTemplates] = useState<Option[]>([]);
  const [satuan, setSatuan] = useState<Option[]>([]);

  const [formData, setFormData] = useState<FormBast>({
    template_id: "",
    id_pegawai: "",
    id_jabatan: "",
    id_survei: "",
    tanggal_bast: "",
    realisasi: "",
    target: "",
    satuan: "",
    bentuk: "",
    alamat: "",
    catatan: "",
  });

  // ============================
  // LOAD DATA DROPDOWN
  // ============================
  useEffect(() => {
    Promise.all([
      axios.get("/public/pegawai"),
      axios.get("/public/jabatan"),
      axios.get("/public/survei"),
      axios.get("/public/satuan"),
      axios.get("/public/template-bast"),
    ])
      .then(([p, j, s, sa, t]) => {
        setPegawai(p.data.data || []);
        setJabatan(j.data.data || []);
        setSurvei(s.data.data || []);
        setSatuan(sa.data.data || []);
        setTemplates(t.data.data || []);
      })
      .catch(() => showError("Gagal memuat data"));
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ============================
  // SIMPAN SAJA
  // ============================
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("/bast/save", formData);
      if (res.data.success) {
        showSuccess("BAST berhasil disimpan");
        router.push("/user/data_bast");
      } else {
        showError(res.data.message || "Gagal menyimpan BAST");
      }
    } catch (err) {
      showError(getErrorMessage(err, "Gagal menyimpan BAST"));
    } finally {
      setIsLoading(false);
    }
  };

  // ============================
  // SIMPAN + DOWNLOAD
  // ============================
  const handleSubmitAndDownload = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("/bast/generate", formData, {
        responseType: "blob",
      });

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);

      let fileName = "bast.docx";
      const disposition = res.headers["content-disposition"];
      if (disposition) {
        const match = disposition.match(/filename="(.+)"/);
        if (match?.[1]) fileName = match[1];
      }

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);

      showSuccess("BAST berhasil disimpan & didownload");
      router.push("/user/data_bast");
    } catch (err) {
      showError(getErrorMessage(err, "Gagal generate BAST"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 px-6 min-h-screen bg-white">
      <h1 className="text-2xl font-bold text-blue-950 mb-4">Simpan</h1>
      <h2 className="inline-block bg-[#30387B] text-white px-5 py-2 rounded mb-10">
        Form BAST
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-8 max-w-5xl text-black"
      >
        {/* KOLOM KIRI */}
        <div className="space-y-6">
          <SelectField
            label="Template BAST"
            name="template_id"
            value={formData.template_id}
            onChange={handleChange}
            options={templates.map((t) => ({
              value: t.id.toString(),
              label: t.judul_template || "",
            }))}
          />

          <SelectField
            label="Pegawai"
            name="id_pegawai"
            value={formData.id_pegawai}
            onChange={handleChange}
            options={pegawai.map((p) => ({
              value: p.id.toString(),
              label: p.nama || "",
            }))}
          />

          <SelectField
            label="Jabatan"
            name="id_jabatan"
            value={formData.id_jabatan}
            onChange={handleChange}
            options={jabatan.map((j) => ({
              value: j.id.toString(),
              label: j.nama_jabatan || "",
            }))}
          />

          <SelectField
            label="Survei"
            name="id_survei"
            value={formData.id_survei}
            onChange={handleChange}
            options={survei.map((s) => ({
              value: s.id.toString(),
              label: s.nama_survei || "",
            }))}
          />

          <InputField
            label="Tanggal BAST"
            type="date"
            name="tanggal_bast"
            value={formData.tanggal_bast}
            onChange={handleChange}
          />
        </div>

        {/* KOLOM KANAN */}
        <div className="space-y-6">
          <InputField
            label="Realisasi"
            name="realisasi"
            value={formData.realisasi}
            onChange={handleChange}
          />

          <InputField
            label="Target"
            name="target"
            value={formData.target}
            onChange={handleChange}
          />

          <SelectField
            label="Satuan"
            name="satuan"
            value={formData.satuan}
            onChange={handleChange}
            options={satuan.map((s) => ({
              value: s.id.toString(),
              label: s.uraian || "",
            }))}
          />

          <InputField
            label="Bentuk"
            name="bentuk"
            value={formData.bentuk}
            onChange={handleChange}
          />

          <InputField
            label="Alamat"
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
          />

          <InputField
            label="Catatan"
            name="catatan"
            value={formData.catatan}
            onChange={handleChange}
          />
        </div>

        {/* BUTTON */}
        <div className="col-span-2 mt-6 flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#30387B] text-white px-8 py-2 rounded hover:bg-[#23255f] disabled:opacity-50"
          >
            Simpan BAST
          </button>

          <button
            type="button"
            onClick={handleSubmitAndDownload}
            disabled={isLoading}
            className="bg-green-600 text-white px-8 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Simpan & Download
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 px-8 py-2 rounded hover:bg-gray-400"
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
const InputField = ({ label, ...rest }: any) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700">
      {label}
    </label>
    <input
      {...rest}
      className="w-full h-10 px-4 border border-gray-300 rounded focus:ring-2 focus:ring-[#30387B]"
    />
  </div>
);

// ======================
// SELECT FIELD
// ======================
const SelectField = ({ label, options, ...rest }: any) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700">
      {label}
    </label>
    <select
      {...rest}
      className="w-full h-10 px-4 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-[#30387B]"
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
