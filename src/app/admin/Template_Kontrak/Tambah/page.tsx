"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/app/utils/axiosAPI";
import { showSuccess, showError } from "@/app/utils/toast";

export default function TambahTemplateKontrakPage() {
  const [judulTemplate, setJudulTemplate] = useState("");
  const [pembuat, setPembuat] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("judul_template", judulTemplate);
      formData.append("pembuat", pembuat);
      if (file) formData.append("file", file);

      await axios.post("/templates/kontrak", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showSuccess("Template kontrak berhasil ditambahkan!");
      router.push("/admin/Template_Kontrak");
    } catch (error) {
      showError(getErrorMessage(error, "Gagal menambahkan template kontrak."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-xl font-bold text-gray-800 mb-6">
          Tambah Template Kontrak
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Judul Template */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Template Kontrak
            </label>
            <input
              type="text"
              value={judulTemplate}
              onChange={(e) => setJudulTemplate(e.target.value)}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Input Pembuat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pembuat
            </label>
            <input
              type="text"
              value={pembuat}
              onChange={(e) => setPembuat(e.target.value)}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Input File */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File Template (PDF/DOCX)
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="file-upload"
                className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-black text-sm hover:bg-gray-100"
              >
                Pilih File
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  setFile(e.target.files ? e.target.files[0] : null)
                }
                className="hidden"
              />
              {file && (
                <span className="text-sm text-gray-700">{file.name}</span>
              )}
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/Template_Kontrak")}
              className="px-4 py-2 border text-[#30387B] border-[#30387B] rounded-md"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#30387B] text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
