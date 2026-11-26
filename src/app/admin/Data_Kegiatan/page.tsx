"use client";

import { useEffect, useState } from "react";
import { Search, Trash2, Pencil, X } from "lucide-react";
import Link from "next/link";
import axios from "@/app/utils/axiosAPI";
import SpinnerHalaman from "@/app/components/shared/SpinnerHalaman";
import Pagination from "@/app/components/shared/Pagination";
import { showSuccess, showError } from "@/app/utils/toast";

interface Teknis {
  id: number;
  nama_teknis: string;
  kode_teknis: string;
}

interface Aktivitas {
  id: number;
  nama_aktivitas: string;
  kode_aktivitas: string;
}

interface Survei {
  id: number;
  nama_survei: string;
  kode_survei: string;
}

interface Kegiatan {
  id: number;
  nama_teknis: string;
  nama_aktivitas: string;
  nama_survei: string;
  teknis_id: number;
  aktivitas_id: number;
  survei_id: number;
}

interface EditKegiatanData {
  id: number;
  teknis_id: number | string;
  aktivitas_id: number | string;
  survei_id: number | string;
}

export default function DataKegiatanPage() {
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [teknisList, setTeknisList] = useState<Teknis[]>([]);
  const [aktivitasList, setAktivitasList] = useState<Aktivitas[]>([]);
  const [surveiList, setSurveiList] = useState<Survei[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingKegiatan, setEditingKegiatan] =
    useState<EditKegiatanData | null>(null);
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

      const [kegiatanRes, teknisRes, aktivitasRes, surveiRes] =
        await Promise.all([
          axios.get("/kegiatan"),
          axios.get("/teknis"),
          axios.get("/aktivitas"),
          axios.get("/survei"),
        ]);

      setKegiatanList(kegiatanRes.data?.data || kegiatanRes.data || []);
      setTeknisList(teknisRes.data?.data || teknisRes.data || []);
      setAktivitasList(aktivitasRes.data?.data || aktivitasRes.data || []);
      setSurveiList(surveiRes.data?.data || surveiRes.data || []);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403)
        return;
      if (error.response) {
        setError(
          `Error ${error.response.status}: ${error.response.data.message || "Server error"}`,
        );
      } else if (error.request) {
        setError("No response from server. Check your connection.");
      } else {
        setError("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data kegiatan ini?"))
      return;

    try {
      await axios.delete(`/kegiatan/${id}`);
      showSuccess("Data kegiatan berhasil dihapus!");
      setKegiatanList(kegiatanList.filter((item) => item.id !== id));
    } catch (error) {
      showError(getErrorMessage(error, "Gagal menghapus data, coba lagi."));
    }
  };

  const handleEdit = (kegiatan: Kegiatan) => {
    setEditingKegiatan({
      id: kegiatan.id,
      teknis_id: kegiatan.teknis_id || getTeknisIdByName(kegiatan.nama_teknis),
      aktivitas_id:
        kegiatan.aktivitas_id || getAktivitasIdByName(kegiatan.nama_aktivitas),
      survei_id: kegiatan.survei_id || getSurveiIdByName(kegiatan.nama_survei),
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateKegiatan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKegiatan) return;

    setIsSubmitting(true);
    try {
      const response = await axios.put(`/kegiatan/${editingKegiatan.id}`, {
        teknis_id: Number(editingKegiatan.teknis_id),
        aktivitas_id: Number(editingKegiatan.aktivitas_id),
        survei_id: Number(editingKegiatan.survei_id),
      });

      // Get the updated names
      const updatedTeknis = teknisList.find(
        (t) => t.id === Number(editingKegiatan.teknis_id),
      );
      const updatedAktivitas = aktivitasList.find(
        (a) => a.id === Number(editingKegiatan.aktivitas_id),
      );
      const updatedSurvei = surveiList.find(
        (s) => s.id === Number(editingKegiatan.survei_id),
      );

      // Update kegiatan state with complete data
      setKegiatanList(
        kegiatanList.map((kegiatan) =>
          kegiatan.id === editingKegiatan.id
            ? {
                ...kegiatan,
                teknis_id: Number(editingKegiatan.teknis_id),
                aktivitas_id: Number(editingKegiatan.aktivitas_id),
                survei_id: Number(editingKegiatan.survei_id),
                nama_teknis: updatedTeknis?.nama_teknis || kegiatan.nama_teknis,
                nama_aktivitas:
                  updatedAktivitas?.nama_aktivitas || kegiatan.nama_aktivitas,
                nama_survei: updatedSurvei?.nama_survei || kegiatan.nama_survei,
                // Include other fields from response if available
                ...(response.data?.data || {}),
              }
            : kegiatan,
        ),
      );

      showSuccess("Data kegiatan berhasil diperbarui!");
      setIsEditModalOpen(false);
      setEditingKegiatan(null);
    } catch (error) {
      showError(getErrorMessage(error, "Gagal memperbarui data kegiatan."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingKegiatan(null);
  };

  // Helper functions to get IDs by name (fallback if IDs are not provided)
  const getTeknisIdByName = (name: string) => {
    const teknisData = teknisList.find((t) => t.nama_teknis === name);
    return teknisData?.id || "";
  };

  const getAktivitasIdByName = (name: string) => {
    const aktivitasData = aktivitasList.find((a) => a.nama_aktivitas === name);
    return aktivitasData?.id || "";
  };

  const getSurveiIdByName = (name: string) => {
    const surveiData = surveiList.find((s) => s.nama_survei === name);
    return surveiData?.id || "";
  };

  const filteredData = kegiatanList.filter((item) => {
    const keyword = searchTerm.toLowerCase();
    return (
      item.nama_teknis.toLowerCase().includes(keyword) ||
      item.nama_aktivitas.toLowerCase().includes(keyword) ||
      item.nama_survei.toLowerCase().includes(keyword)
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
      <h1 className="text-2xl font-bold text-blue-950 mb-4">Data Kegiatan</h1>

      <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <Search className="absolute top-2.5 left-3 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari kegiatan"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#30387B] text-black w-64"
            />
          </div>

          <Link
            href="/admin/Data_Kegiatan/Tambah"
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
              <th className="px-4 py-3">Nama Teknis</th>
              <th className="px-4 py-3">Aktivitas</th>
              <th className="px-4 py-3">Survei</th>
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
                  <td className="px-4 py-3">{item.nama_teknis}</td>
                  <td className="px-4 py-3">{item.nama_aktivitas}</td>
                  <td className="px-4 py-3">{item.nama_survei}</td>
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
                  colSpan={5}
                  className="text-center py-6 text-gray-500 italic"
                >
                  {kegiatanList.length === 0
                    ? "Data kegiatan kosong."
                    : "Tidak ada hasil pencarian."}
                </td>
              </tr>
            )}

            {currentData.length < itemsPerPage &&
              Array.from({ length: itemsPerPage - currentData.length }).map(
                (_, i) => (
                  <tr key={`empty-${i}`}>
                    <td colSpan={5} className="py-4">
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
      {isEditModalOpen && editingKegiatan && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Edit Data Kegiatan
              </h2>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 transition"
                disabled={isSubmitting}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateKegiatan} className="p-6 space-y-4">
              {/* Teknis Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Teknis <span className="text-red-500">*</span>
                </label>
                <select
                  value={editingKegiatan.teknis_id}
                  onChange={(e) =>
                    setEditingKegiatan({
                      ...editingKegiatan,
                      teknis_id:
                        e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30387B] text-black"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Pilih Teknis</option>
                  {teknisList.map((teknis) => (
                    <option key={teknis.id} value={teknis.id}>
                      {teknis.nama_teknis} - {teknis.kode_teknis}
                    </option>
                  ))}
                </select>
              </div>

              {/* Aktivitas Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Aktivitas <span className="text-red-500">*</span>
                </label>
                <select
                  value={editingKegiatan.aktivitas_id}
                  onChange={(e) =>
                    setEditingKegiatan({
                      ...editingKegiatan,
                      aktivitas_id:
                        e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30387B] text-black"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Pilih Aktivitas</option>
                  {aktivitasList.map((aktivitas) => (
                    <option key={aktivitas.id} value={aktivitas.id}>
                      {aktivitas.nama_aktivitas}
                    </option>
                  ))}
                </select>
              </div>

              {/* Survei Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Survei <span className="text-red-500">*</span>
                </label>
                <select
                  value={editingKegiatan.survei_id}
                  onChange={(e) =>
                    setEditingKegiatan({
                      ...editingKegiatan,
                      survei_id:
                        e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30387B] text-black"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Pilih Survei</option>
                  {surveiList.map((survei) => (
                    <option key={survei.id} value={survei.id}>
                      {survei.nama_survei}
                    </option>
                  ))}
                </select>
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
