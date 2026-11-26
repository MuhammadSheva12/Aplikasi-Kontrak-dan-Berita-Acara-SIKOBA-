"use client";

import { useEffect, useState } from "react";
import { Search, Trash2, Pencil, X } from "lucide-react";
import Link from "next/link";
import axios from "@/app/utils/axiosAPI";
import SpinnerHalaman from "@/app/components/shared/SpinnerHalaman";
import Pagination from "@/app/components/shared/Pagination";
import { showSuccess, showError } from "@/app/utils/toast";

interface TemplateKontrak {
  id: number;
  judul_template: string;
  pembuat: string;
  tanggal_update?: string;
  file_name?: string;
  original_name?: string;
}

export default function DataTemplateKontrakPage() {
  const [data, setData] = useState<TemplateKontrak[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<TemplateKontrak | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/templates/kontrak");
      setData(res.data?.data || res.data || []);
    } catch (error) {
      setError(getErrorMessage(error, "Gagal memuat data."));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus template ini?")) return;

    try {
      await axios.delete(`/templates/kontrak/${id}`);
      showSuccess("Data template berhasil dihapus!");
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      showError(getErrorMessage(error, "Gagal menghapus data."));
    }
  };

  const handleEdit = (item: TemplateKontrak) => {
    setEditingTemplate(item);
    setFile(null);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("judul_template", editingTemplate.judul_template);
      formData.append("pembuat", editingTemplate.pembuat);
      if (file) formData.append("file", file);

      await axios.put(`/templates/kontrak/${editingTemplate.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchData();
      showSuccess("Data template berhasil diperbarui!");
      setIsEditModalOpen(false);
      setEditingTemplate(null);
    } catch (error) {
      showError(getErrorMessage(error, "Gagal memperbarui data."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredData = data.filter((item) =>
    item.judul_template.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white pt-24 px-6 pb-4">
      <h1 className="text-2xl font-bold text-blue-950 mb-4">
        Data Template Kontrak
      </h1>

      {/* Search & Tambah */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <Search className="absolute top-2.5 left-3 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari template"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#30387B] text-black w-64"
            />
          </div>

          <Link
            href="/admin/Template_Kontrak/Tambah"
            className="bg-[#30387B] text-white px-5 py-2 rounded hover:bg-blue-800 transition"
          >
            + Tambah Template Surat
          </Link>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-4 py-2 shadow-sm">
          <span className="text-sm font-medium text-gray-700">Total Data:</span>
          <span className="ml-2 bg-[#30387B] text-white text-sm font-bold px-3 py-1 rounded-full">
            {filteredData.length}
          </span>
        </div>
      </div>

      {/* Table */}
      {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
      {loading && <SpinnerHalaman />}

      <div className="rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-[#30387B] text-white uppercase text-xs font-semibold text-center">
            <tr>
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Judul Template Kontrak</th>
              <th className="px-4 py-3">Pembuat</th>
              <th className="px-4 py-3">Tanggal Update</th>
              <th className="px-4 py-3">File</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr
                  key={item.id || index}
                  className="border-b hover:bg-gray-50 text-center"
                >
                  <td className="px-4 py-3">{startIndex + index + 1}</td>
                  <td className="px-4 py-3">{item.judul_template}</td>
                  <td className="px-4 py-3">{item.pembuat}</td>
                  <td className="px-4 py-3">
                    {item.tanggal_update
                      ? new Date(item.tanggal_update).toLocaleString("id-ID")
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {item.file_name ? (
                      <a
                        href={`http://localhost:5000/uploads/${item.file_name}`}
                        target="_blank"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        {item.original_name || item.file_name}
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">-</span>
                    )}
                  </td>

                  <td className="px-4 py-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-500 italic"
                >
                  {data.length === 0
                    ? "Data kosong."
                    : "Tidak ada hasil pencarian."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onPrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        />
      )}

      {/* Modal Edit */}
      {isEditModalOpen && editingTemplate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Edit Template</h2>
              <button onClick={() => setIsEditModalOpen(false)}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Template Kontrak
                </label>
                <input
                  type="text"
                  value={editingTemplate.judul_template}
                  onChange={(e) =>
                    setEditingTemplate({
                      ...editingTemplate,
                      judul_template: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-[#30387B] focus:border-[#30387B] transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pembuat
                </label>
                <input
                  type="text"
                  value={editingTemplate.pembuat}
                  onChange={(e) =>
                    setEditingTemplate({
                      ...editingTemplate,
                      pembuat: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-[#30387B] focus:border-[#30387B] transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File (Opsional)
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    setFile(e.target.files ? e.target.files[0] : null)
                  }
                  className="w-full text-sm text-gray-900"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#30387B] text-white rounded-md hover:bg-[#23295f] transition"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
