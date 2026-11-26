"use client";

import { Lock, Unlock, Trash2, Search, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { showSuccess, showError } from "@/app/utils/toast";
import axios from "@/app/utils/axiosAPI";
import Link from "next/link";
import SpinnerHalaman from "@/app/components/shared/SpinnerHalaman";
import Pagination from "@/app/components/shared/Pagination";

interface Teknis {
  id: number;
  nama_teknis: string;
  kode_teknis: string;
}

interface Pegawai {
  id: number;
  nama: string;
  nip: string;
  jabatan: string;
}

interface User {
  id: number;
  username: string;
  password: string;
  role: "admin" | "user";
  nama_pegawai: string;
  nama_teknis: string;
  pegawai_id: number;
  teknis_id: number;
  created_at: string;
  updated_at: string;
}

interface EditUserData {
  id: number;
  username: string;
  password: string;
  role: "admin" | "user";
  pegawai_id: number | string;
  teknis_id: number | string;
}

function maskPassword(password: string) {
  return "*".repeat(password.length || 8);
}

export default function KelolaUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [teknis, setTeknis] = useState<Teknis[]>([]);
  const [pegawai, setPegawai] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<number[]>([]);
  const [decryptedPasswords, setDecryptedPasswords] = useState<{
    [key: number]: string;
  }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<EditUserData | null>(null);
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
      const [usersRes, teknisRes, pegawaiRes] = await Promise.all([
        axios.get("/users"),
        axios.get("/teknis"),
        axios.get("/pegawai"),
      ]);

      setUsers(usersRes.data?.data || usersRes.data || []);
      setTeknis(teknisRes.data?.data || teknisRes.data || []);
      setPegawai(pegawaiRes.data?.data || pegawaiRes.data || []);
    } catch (error) {
      console.error("Fetch error:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        return;
      }

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
    if (!confirm("Apakah Anda yakin ingin menghapus user ini?")) return;

    try {
      await axios.delete(`/users/${id}`);
      showSuccess("User berhasil dihapus!");
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      showError(getErrorMessage(error, "Gagal menghapus user, coba lagi."));
    }
  };

  const handleEdit = async (user: User) => {
    try {
      // Get decrypted password if not already available
      let decryptedPassword = decryptedPasswords[user.id];
      if (!decryptedPassword) {
        const response = await axios.get(`/users/${user.id}/decrypt-password`);
        decryptedPassword = response.data.decryptedPassword;
        setDecryptedPasswords((prev) => ({
          ...prev,
          [user.id]: decryptedPassword,
        }));
      }

      setEditingUser({
        id: user.id,
        username: user.username,
        password: decryptedPassword,
        role: user.role,
        pegawai_id: user.pegawai_id || getPegawaiIdByName(user.nama_pegawai),
        teknis_id: user.teknis_id || getTeknisIdByName(user.nama_teknis),
      });
      setIsEditModalOpen(true);
    } catch (error) {
      showError("Gagal mengambil data user untuk edit.");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsSubmitting(true);
    try {
      const response = await axios.put(`/users/${editingUser.id}`, {
        username: editingUser.username,
        password: editingUser.password,
        role: editingUser.role,
        pegawai_id: Number(editingUser.pegawai_id),
        teknis_id: Number(editingUser.teknis_id),
      });

      // Get the updated pegawai and teknis names
      const updatedPegawai = pegawai.find(
        (p) => p.id === Number(editingUser.pegawai_id),
      );
      const updatedTeknis = teknis.find(
        (t) => t.id === Number(editingUser.teknis_id),
      );

      // Update users state with complete data including the names
      setUsers(
        users.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                username: editingUser.username,
                role: editingUser.role,
                pegawai_id: Number(editingUser.pegawai_id),
                teknis_id: Number(editingUser.teknis_id),
                nama_pegawai: updatedPegawai?.nama || user.nama_pegawai,
                nama_teknis: updatedTeknis?.nama_teknis || user.nama_teknis,
                // Include other fields from response if available
                ...(response.data?.data || {}),
              }
            : user,
        ),
      );

      // Update decrypted password cache
      setDecryptedPasswords((prev) => ({
        ...prev,
        [editingUser.id]: editingUser.password,
      }));

      showSuccess("User berhasil diperbarui!");
      setIsEditModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      showError(getErrorMessage(error, "Gagal memperbarui user."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const getPegawaiIdByName = (name: string | number) => {
    const pegawaiData = pegawai.find(
      (p) => p.id.toString() === name.toString() || p.nama === name,
    );
    return pegawaiData?.id || "";
  };

  const getTeknisIdByName = (name: string | number) => {
    const teknisData = teknis.find(
      (t) => t.id.toString() === name.toString() || t.nama_teknis === name,
    );
    return teknisData?.id || "";
  };

  const getTeknisName = (teknisValue: string | number) => {
    const teknisData = teknis.find(
      (t) =>
        t.id.toString() === teknisValue.toString() ||
        t.nama_teknis === teknisValue,
    );
    return teknisData?.nama_teknis || teknisValue || "-";
  };

  const getPegawaiName = (pegawaiValue: string | number) => {
    const pegawaiData = pegawai.find(
      (p) =>
        p.id.toString() === pegawaiValue.toString() || p.nama === pegawaiValue,
    );
    return pegawaiData?.nama || pegawaiValue || "-";
  };

  const togglePasswordVisibility = async (id: number) => {
    if (visiblePasswords.includes(id)) {
      setVisiblePasswords(visiblePasswords.filter((vid) => vid !== id));
    } else {
      if (!decryptedPasswords[id]) {
        try {
          const response = await axios.get(`/users/${id}/decrypt-password`);
          setDecryptedPasswords((prev) => ({
            ...prev,
            [id]: response.data.decryptedPassword,
          }));
        } catch {
          showError("Gagal mengambil password terdekripsi.");
          return;
        }
      }
      setVisiblePasswords([...visiblePasswords, id]);
    }
  };

  const filteredUsers = users.filter((user) => {
    const pegawaiName = String(getPegawaiName(user.nama_pegawai)).toLowerCase();
    const teknisName = String(getTeknisName(user.nama_teknis)).toLowerCase();
    const username = String(user.username).toLowerCase();
    const keyword = searchTerm.toLowerCase();

    return (
      pegawaiName.includes(keyword) ||
      teknisName.includes(keyword) ||
      username.includes(keyword)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePrevious = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white pt-24 px-6 pb-4">
      <h1 className="text-2xl font-bold text-blue-950 mb-4">Data User</h1>

      <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <Search className="absolute top-2.5 left-3 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#30387B] text-black w-64"
            />
          </div>

          <Link
            href="/admin/Kelola_User/TambahUser"
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
              {filteredUsers.length}
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
              <th className="px-4 py-3">Nama Pegawai</th>
              <th className="px-4 py-3">Teknis</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Password</th>
              <th className="px-4 py-3">Role</th>
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
                  <td className="px-4 py-3">
                    {getPegawaiName(item.nama_pegawai)}
                  </td>
                  <td className="px-4 py-3">
                    {getTeknisName(item.nama_teknis)}
                  </td>
                  <td className="px-4 py-3">{item.username}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center items-center gap-2">
                      <span className="font-mono truncate max-w-[100px]">
                        {visiblePasswords.includes(item.id)
                          ? decryptedPasswords[item.id] || (
                              <span className="text-gray-400 italic">
                                Memuat...
                              </span>
                            )
                          : maskPassword(
                              decryptedPasswords[item.id] ?? "••••••",
                            )}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(item.id)}
                        className="p-1.5 rounded-md hover:bg-gray-200 transition"
                        title={
                          visiblePasswords.includes(item.id)
                            ? "Sembunyikan Password"
                            : "Tampilkan Password"
                        }
                      >
                        {visiblePasswords.includes(item.id) ? (
                          <Unlock className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.role === "admin"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
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
                  colSpan={7}
                  className="text-center py-6 text-gray-500 italic"
                >
                  {users.length === 0
                    ? "Data user kosong."
                    : "Tidak ada hasil pencarian."}
                </td>
              </tr>
            )}

            {currentData.length < itemsPerPage &&
              Array.from({ length: itemsPerPage - currentData.length }).map(
                (_, i) => (
                  <tr key={`empty-${i}`}>
                    <td colSpan={7} className="py-4">
                      &nbsp;
                    </td>
                  </tr>
                ),
              )}
          </tbody>
        </table>
      </div>

      {filteredUsers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Edit User</h2>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 transition"
                disabled={isSubmitting}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              {/* Pegawai Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Pegawai <span className="text-red-500">*</span>
                </label>
                <select
                  value={editingUser.pegawai_id}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      pegawai_id:
                        e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30387B] text-black"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Pilih Pegawai</option>
                  {pegawai.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} - {p.nip}
                    </option>
                  ))}
                </select>
              </div>

              {/* Teknis Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teknis <span className="text-red-500">*</span>
                </label>
                <select
                  value={editingUser.teknis_id}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      teknis_id:
                        e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30387B] text-black"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Pilih Teknis</option>
                  {teknis.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nama_teknis} - {t.kode_teknis}
                    </option>
                  ))}
                </select>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, username: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30387B] text-black"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={editingUser.password}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30387B] text-black"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      role: e.target.value as "admin" | "user",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#30387B] text-black"
                  required
                  disabled={isSubmitting}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
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
