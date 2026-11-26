"use client";

import { useEffect, useState } from "react";
import { Search, Trash2, Pencil, X } from "lucide-react";
import Link from "next/link";
import axios from "@/app/utils/axiosAPI";
import SpinnerHalaman from "@/app/components/shared/SpinnerHalaman";
import Pagination from "@/app/components/shared/Pagination";
import { showSuccess, showError } from "@/app/utils/toast";
import { isAxiosError } from "axios";
import { getErrorMessage } from "@/app/utils/getErrorMessage";

interface MitraLainnya {
  id: number;
  nama: string;
  nik: string;
  alamat: string;
  pekerjaan: string;
}

interface EditMitraData {
  id: number;
  nama: string;
  nik: string;
  alamat: string;
  pekerjaan: string;
}

export default function DataMitraLainnyaPage() {
  const [data, setData] = useState<MitraLainnya[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMitra, setEditingMitra] = useState<EditMitraData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const res = await axios.get("/mitra/lainnya");
      setData(res.data?.data || res.data || []);
} catch (error) {
  if (isAxiosError<{ message?: string }>(error)) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return;
    }
    if (error.response) {
      setError(
        `Error ${error.response.status}: ${error.response.data?.message || "Server error"}`
      );
    } else if (error.request) {
      setError("No response from server. Check your connection.");
    }
  } else if (error instanceof Error) {
    setError("Error: " + error.message);
  }
} finally {
  setLoading(false);
}
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus mitra ini?")) return;

    try {
      await axios.delete(`/mitra/lainnya/${id}`);
      showSuccess("Data mitra berhasil dihapus!");
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      showError(getErrorMessage(error, "Gagal menghapus data, coba lagi."));
    }
  };

  const handleEdit = (mitra: MitraLainnya) => {
    setEditingMitra({
      id: mitra.id,
      nama: mitra.nama,
      nik: mitra.nik,
      alamat: mitra.alamat,
      pekerjaan: mitra.pekerjaan,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateMitra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMitra) return;

    setIsSubmitting(true);
    try {
      const response = await axios.put(`/mitra/lainnya/${editingMitra.id}`, {
        nama: editingMitra.nama,
        nik: editingMitra.nik,
        alamat: editingMitra.alamat,
        pekerjaan: editingMitra.pekerjaan,
      });

      // Update data state with the updated mitra
      setData(
        data.map((item) =>
          item.id === editingMitra.id
            ? {
                ...item,
                nama: editingMitra.nama,
                nik: editingMitra.nik,
                alamat: editingMitra.alamat,
                pekerjaan: editingMitra.pekerjaan,
                // Include other fields from response if available
                ...(response.data?.data || {}),
              }
            : item,
        ),
      );

      showSuccess("Data mitra berhasil diperbarui!");
      setIsEditModalOpen(false);
      setEditingMitra(null);
    } catch (error) {
      showError(getErrorMessage(error, "Gagal memperbarui data mitra."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingMitra(null);
  };

  const filteredData = data.filter((item) => {
    const keyword = searchTerm.toLowerCase();
    return (
      item.nama.toLowerCase().includes(keyword) ||
      item.nik.toLowerCase().includes(keyword) ||
      item.alamat.toLowerCase().includes(keyword) ||
      item.pekerjaan.toLowerCase().includes(keyword)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePrevious = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white pt-24 px-6 pb-4">
      <h1 className="text-2xl font-bold text-blue-950 mb-4">
        Data Mitra Lainnya
      </h1>

      <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <Search className="absolute top-2.5 left-3 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari mitra"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#30387B] text-black w-64"
            />
          </div>

          <Link
            href="/admin/Mitra_Lainnya/Tambah"
            className="bg-[#30387B] text-white px-5 py-2 rounded hover:bg-blue-800 transition duration-200 font-medium shadow-sm hover:shadow-md"
          >
            + Tambah Data
          </Link>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-4 py-2 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#30387B] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              Total Data:
            </span>
            <span className="bg-[#30387B] text-white text-sm font-bold px-3 py-1 rounded-full min-w-[40px] text-center">
              {filteredData.length}
            </span>
          </div>
        </div>
      </div>

      {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
      {loading && <SpinnerHalaman />}

      <div className="rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <table className="min-w-full table-fixed text-sm text-left text-gray-700">
          <thead className="bg-[#30387B] text-white uppercase text-xs font-semibold text-center sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 rounded-tl-xl">No</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">NIK</th>
              <th className="px-4 py-3">Alamat</th>
              <th className="px-4 py-3">Pekerjaan</th>
              <th className="px-4 py-3 rounded-tr-xl">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition-colors text-center"
                >
                  <td className="px-4 py-3">{startIndex + index + 1}</td>
                  <td className="px-4 py-3">{item.nama}</td>
                  <td className="px-4 py-3">{item.nik}</td>
                  <td className="px-4 py-3">{item.alamat}</td>
                  <td className="px-4 py-3">{item.pekerjaan}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4 me-1" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
                    ? "Data mitra kosong."
                    : "Tidak ada hasil pencarian."}
                </td>
              </tr>
            )}

            {currentData.length < itemsPerPage &&
              Array.from({ length: itemsPerPage - currentData.length }).map(
                (_, i) => (
                  <tr key={`empty-${i}`}>
                    <td colSpan={6} className="py-4">
                      &nbsp;
                    </td>
                  </tr>
                ),
              )}
          </tbody>
        </table>
      </div>

      {filteredData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingMitra && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Edit Data Teknis
              </h2>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 transition"
                disabled={isSubmitting}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateMitra} className="p-6 space-y-4">
              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingMitra.nama}
                  onChange={(e) =>
                    setEditingMitra({ ...editingMitra, nama: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30387B] text-black"
                  placeholder="Masukkan nama lengkap"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* NIK */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIK <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingMitra.nik}
                  onChange={(e) =>
                    setEditingMitra({ ...editingMitra, nik: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30387B] text-black"
                  placeholder="Masukkan NIK (16 digit)"
                  maxLength={16}
                  pattern="[0-9]{16}"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Alamat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editingMitra.alamat}
                  onChange={(e) =>
                    setEditingMitra({ ...editingMitra, alamat: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30387B] text-black resize-none"
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Pekerjaan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pekerjaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingMitra.pekerjaan}
                  onChange={(e) =>
                    setEditingMitra({
                      ...editingMitra,
                      pekerjaan: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30387B] text-black"
                  placeholder="Masukkan pekerjaan"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#30387B] text-white rounded-md hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
