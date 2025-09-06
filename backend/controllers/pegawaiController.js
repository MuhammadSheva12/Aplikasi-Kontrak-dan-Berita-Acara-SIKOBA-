const { m } = require("framer-motion");
const {
  getAllPegawai,
  getPegawaiById,
  createPegawai,
  updatePegawai,
  deletePegawai,
  getPegawaiCount,
} = require("../models/pegawaiModel");

const getPegawaiList = async (req, res) => {
  try {
    const pegawai = await getAllPegawai();
    res.json({ message: "Success", data: pegawai });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPegawai = async (req, res) => {
  const { id } = req.params;
  try {
    const pegawai = await getPegawaiById(id);
    if (!pegawai) return res.status(404).json({ message: "Data pegawai tidak ditemukan" });
    res.json(pegawai);
  } catch (err) {
    console.error("Error in getPegawai:", err);
    res.status(500).json({ message: "Gagal mengambil data pegawai" });
  }
};

const createNewPegawai = async (req, res) => {
  const { nama_pegawai, nip, jabatan } = req.body;
  if (!nama_pegawai || !nip || !jabatan) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }
  try {
    await createPegawai({ nama_pegawai, nip, jabatan });
    res.status(201).json({ message: "Data pegawai berhasil ditambahkan" });
  } catch (err) {
    console.error("Error in createNewPegawai:", err);
    res.status(500).json({ message: "Gagal menambahkan data pegawai" });
  }   
};

const updatePegawaiById = async (req, res) => {
  const { id } = req.params;
  const { nama_pegawai, nip, jabatan } = req.body;
  try {
    await updatePegawai(id, { nama_pegawai, nip, jabatan });
    res.json({ message: "Data pegawai berhasil diperbarui" });
  } catch (err) {
    console.error("Error in updatePegawaiById:", err);
    res.status(500).json({ message: "Gagal memperbarui data pegawai" });
  }
};

const deletePegawaiById = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await deletePegawai(id);
    if (!deleted) return res.status(404).json({ message: "Data pegawai tidak ditemukan" });
    res.json({ message: "Data pegawai berhasil dihapus", data: deleted });
  } catch (err) {
    console.error("Error in deletePegawaiById:", err);
    res.status(500).json({ message: "Gagal menghapus data pegawai" });
  }
};

const getPegawaiCountHandler = async (req, res) => {
  try {
    const count = await getPegawaiCount();// Assuming getAllPegawai returns an array
    res.json({ jumlah: count });
  } catch (err) {
    console.error("Error in getPegawaiCount:", err);
    res.status(500).json({ message: "Gagal mengambil jumlah pegawai" });
  }
};

module.exports = {
  getPegawaiList,
  getPegawai,
  createNewPegawai, 
  updatePegawaiById,
  deletePegawaiById,
  getPegawaiCountHandler
};