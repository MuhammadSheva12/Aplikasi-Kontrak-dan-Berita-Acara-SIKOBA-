"use client";

import { useEffect, useState } from "react";
import axios from "@/app/utils/axiosAPI";
import { Pencil } from "lucide-react";
import { showSuccess, showError } from "@/app/utils/toast";

interface Pejabat {
  id: number;
  nama_pejabat_pembuat_komitmen: string;
  nip: string;
}

interface Dipa {
  id: number;
  nomor_dipa: string;
  tanggal: string;
}

export default function KelolaPejabat() {
  const [pejabatList, setPejabatList] = useState<Pejabat[]>([]);
  const [dipaList, setDipaList] = useState<Dipa[]>([]);
  const [editPejabat, setEditPejabat] = useState<Pejabat | null>(null);
  const [editDIPA, setEditDIPA] = useState<Dipa | null>(null);
  const [showPejabatModal, setShowPejabatModal] = useState(false);
  const [showDipaModal, setShowDipaModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPejabat();
    fetchDipa();
  }, []);

  const fetchPejabat = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/pejabat");
      setPejabatList(response.data?.data || response.data);
    } catch (error) {
      showError("Gagal memuat data pejabat.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDipa = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/dipa");
      setDipaList(response.data?.data || response.data);
    } catch (error) {
      showError("Gagal memuat data DIPA.");
    } finally {
      setIsLoading(false);
    }
  };

  // ================== HANDLE EDIT PEJABAT ==================
  const handleEditPejabatClick = (pejabat: Pejabat) => {
    setEditPejabat(pejabat);
    setShowPejabatModal(true);
  };

  const handleEditPejabatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editPejabat) {
      setEditPejabat({ ...editPejabat, [e.target.name]: e.target.value });
    }
  };

  const handleEditPejabatSubmit = async () => {
    try {
      await axios.put(`/pejabat/${editPejabat?.id}`, editPejabat);
      setShowPejabatModal(false);
      setEditPejabat(null);
      fetchPejabat();
      showSuccess("Data pejabat berhasil diupdate");
    } catch (error) {
      showError("Gagal mengedit data pejabat");
    }
  };

  // ================== HANDLE EDIT DIPA ==================
  const handleEditDipaClick = (dipa: Dipa) => {
    setEditDIPA(dipa);
    setShowDipaModal(true);
  };

  const handleEditDipaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editDIPA) {
      setEditDIPA({ ...editDIPA, [e.target.name]: e.target.value });
    }
  };

  const handleEditDipaSubmit = async () => {
    try {
      await axios.put(`/dipa/${editDIPA?.id}`, editDIPA);
      setShowDipaModal(false);
      setEditDIPA(null);
      fetchDipa();
      showSuccess("Data DIPA berhasil diupdate");
    } catch (error) {
      showError("Gagal mengedit data DIPA");
    }
  };

  // ================== FORMAT TANGGAL ==================
  const formatTanggal = (isoDateString: string) => {
    const date = new Date(isoDateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTanggalForInput = (isoDateString: string) => {
    const date = new Date(isoDateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="pt-24 px-6 min-h-screen bg-white">
      <h1 className="text-2xl font-bold text-blue-950 mb-4">Data Pejabat dan DIPA</h1>

      <h2 className="inline-block bg-[#30387B] text-white px-5 py-2 rounded mb-6">Data Pejabat</h2>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-black">
            <thead className="bg-[#30387B] text-white font-medium">
              <tr>
                <th className="border p-3">No</th>
                <th className="border p-3">Nama Pejabat</th>
                <th className="border p-3">NIP</th>
                <th className="border p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pejabatList.length > 0 ? (
                pejabatList.map((pejabat, index) => (
                  <tr key={pejabat.id} className="text-center text-black bg-white">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{pejabat.nama_pejabat_pembuat_komitmen}</td>
                    <td className="border p-2">{pejabat.nip}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleEditPejabatClick(pejabat)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Pencil className="inline w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">Tidak ada data.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showPejabatModal && editPejabat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative animate-fade-in">
            <h2 className="text-xl font-semibold text-blue-900 text-center mb-6">Edit Data Pejabat</h2>
            <input
              type="text"
              name="nama_pejabat_pembuat_komitmen"
              value={editPejabat.nama_pejabat_pembuat_komitmen}
              onChange={handleEditPejabatChange}
              placeholder="Nama Pejabat"
              className="w-full px-4 py-2 mb-4 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            />
            <input
              type="text"
              name="nip"
              value={editPejabat.nip}
              onChange={handleEditPejabatChange}
              placeholder="NIP"
              className="w-full px-4 py-2 mb-6 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
                onClick={() => {
                  setShowPejabatModal(false);
                  setEditPejabat(null);
                }}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleEditPejabatSubmit}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="inline-block bg-[#30387B] text-white px-5 py-2 rounded mb-6">Data DIPA</h2>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-black">
            <thead className="bg-[#30387B] text-white font-medium">
              <tr>
                <th className="border p-3">No</th>
                <th className="border p-3">Nomor DIPA</th>
                <th className="border p-3">Tanggal</th>
                <th className="border p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dipaList.length > 0 ? (
                dipaList.map((dipa, index) => (
                  <tr key={dipa.id} className="text-center text-black bg-white">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{dipa.nomor_dipa}</td>
                    <td className="border p-2">{formatTanggal(dipa.tanggal)}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleEditDipaClick(dipa)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Pencil className="inline w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">Tidak ada data.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDipaModal && editDIPA && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative animate-fade-in">
            <h2 className="text-xl font-semibold text-blue-900 text-center mb-6">Edit Data DIPA</h2>
            <input
              type="text"
              name="nomor_dipa"
              value={editDIPA.nomor_dipa}
              onChange={handleEditDipaChange}
              placeholder="Nomor DIPA"
              className="w-full px-4 py-2 mb-4 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            />
            <input
              type="date"
              name="tanggal"
              value={formatTanggalForInput(editDIPA.tanggal)}
              onChange={handleEditDipaChange}
              placeholder="Tanggal"
              className="w-full px-4 py-2 mb-6 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
                onClick={() => {
                  setShowDipaModal(false);
                  setEditDIPA(null);
                }}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleEditDipaSubmit}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
