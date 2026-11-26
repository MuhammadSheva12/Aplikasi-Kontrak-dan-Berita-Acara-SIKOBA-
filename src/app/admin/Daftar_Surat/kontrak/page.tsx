"use client";

import { useEffect, useState } from "react";
import { Trash2, Download, Search } from "lucide-react";
import axios from "@/app/utils/axiosAPI";
import SpinnerHalaman from "@/app/components/shared/SpinnerHalaman";
import Pagination from "@/app/components/shared/Pagination";
import { showSuccess, showError } from "@/app/utils/toast";

interface DataKontrak {
  id: number;
  judul_dokumen: string;
  tanggal_generate: string;
  teknis: string;
  jumlah: number;
  file_name: string;
}

/* ===============================
   Helper: hitung "berapa lama"
================================ */
const timeAgo = (tanggal: string) => {
  const now = new Date();
  const past = new Date(tanggal);
  const diffMs = now.getTime() - past.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  return `${days} hari lalu`;
};

export default function DataKontrakPage() {
  const [data, setData] = useState<DataKontrak[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/kontrak");
      setData(res.data?.data || res.data || []);
    } catch {
      showError("Gagal memuat data kontrak");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus data kontrak ini?")) return;
    try {
      await axios.delete(`/kontrak/${id}`);
      showSuccess("Data kontrak berhasil dihapus!");
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch {
      showError("Gagal menghapus data kontrak");
    }
  };

  const filteredData = data.filter((item) =>
    item.judul_dokumen.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white pt-24 px-6 pb-4">
      <h1 className="text-2xl font-bold text-blue-950 mb-4">Data Kontrak</h1>

      {/* Toolbar */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        <div className="relative">
          {/* Icon Search */}
          <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
         <input
  type="text"
  placeholder="Cari kontrak..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="pl-10 pr-4 border border-gray-300 rounded px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#30387B] w-64"
/>


        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 shadow-sm">
          <span className="text-sm font-medium text-gray-700">Total:</span>
          <span className="ml-2 bg-[#30387B] text-white text-sm font-bold px-3 py-1 rounded-full">
            {filteredData.length}
          </span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <SpinnerHalaman />
      ) : (
        <div className="rounded-xl border border-gray-200 shadow-md overflow-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-[#30387B] text-white uppercase text-xs font-semibold sticky top-0">
              <tr>
                <th className="px-4 py-3 text-center rounded-tl-xl w-16">No</th>
                <th className="px-4 py-3 text-center">Judul Surat Kontrak</th>
                <th className="px-4 py-3 text-center w-48">Tanggal & Jam</th>
                <th className="px-4 py-3 text-center w-32">Teknis</th>
                <th className="px-4 py-3 text-center w-24">Jumlah</th>
                <th className="px-4 py-3 text-center rounded-tr-xl w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((item, i) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-center">{startIndex + i + 1}</td>
                    <td className="px-4 py-3 text-center">{item.judul_dokumen}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-medium">
                          {new Date(item.tanggal_generate).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-xs text-gray-500">{timeAgo(item.tanggal_generate)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">{item.teknis}</td>
                    <td className="px-4 py-3 text-center">{item.jumlah}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <a
                          href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${item.file_name}`}
                          download
                          className="text-green-600 hover:bg-green-50 p-1 rounded"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:bg-red-50 p-1 rounded"
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
                  <td colSpan={6} className="text-center py-6 text-gray-500 italic">
                    Tidak ada data kontrak
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {filteredData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onPrevious={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          onNext={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
        />
      )}
    </div>
  );
}
