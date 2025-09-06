const {
  getAllMitraSobat,
  getMitraSobatById,
  createMitraSobat,
  updateMitraSobat,
  deleteMitraSobat,
  getMitraSobatCount,
} = require("../models/mitraSobatModel");

const {
  getAllMitraLainnya,
  getMitraLainnyaById,
  createMitraLainnya,
  updateMitraLainnya,
  deleteMitraLainnya
} = require("../models/mitraLainnyaModel");

// ---------- MITRA SOBAT ----------
const getMitraSobatList = async (req, res) => {
  try {
    const mitra_sobat = await getAllMitraSobat();
    res.json({ message: "Success", data: mitra_sobat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMitraSobat = async (req, res) => {
  const { id } = req.params;
  try {
    const mitra_sobat = await getMitraSobatById(id);
    if (!mitra_sobat) return res.status(404).json({ message: "Mitra tidak ditemukan" });
    res.json(mitra_sobat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createNewMitraSobat = async (req, res) => {
  const { nomor_mitra, nama, nik, alamat } = req.body;
  if (!nomor_mitra || !nama || !nik || !alamat) {
    return res.status(400).json({ message: "Data tidak lengkap" }); 
  }
  try {
    const newMitra = await createMitraSobat({ nomor_mitra, nama, nik, alamat });
    res.status(201).json({ message: "Mitra berhasil ditambahkan", data: newMitra });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } 
};

const updateMitraSobatById = async (req, res) => {
  const { id } = req.params; 
  const { nomor_mitra, nama, nik, alamat } = req.body;
  try { 
    const updated = await updateMitraSobat(id, { nomor_mitra, nama, nik, alamat });
    if (!updated) return res.status(404).json({ message: "Mitra tidak ditemukan" });
    res.json({ message: "Mitra berhasil diperbarui", data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteMitraSobatById = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await deleteMitraSobat(id);
    if (!deleted) return res.status(404).json({ message: "Mitra tidak ditemukan" });
    res.json({ message: "Mitra berhasil dihapus", data: deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMitraSobatCountHandler = async (req, res) => {
  try {
    const count = await getMitraSobatCount();
    res.json({ jumlah: count });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil jumlah Mitra Sobat" });
  }
};

// ---------- MITRA LAINNYA ----------
const getMitraLainnyaList = async (req, res) => {
  try {
    const mitra_lainnya = await getAllMitraLainnya();
    res.json({ message: "Success", data: mitra_lainnya });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMitraLainnya = async (req, res) => {
  const { id } = req.params;
  try {
    const mitra_lainnya = await getMitraLainnyaById(id);
    if (!mitra_lainnya) return res.status(404).json({ message: "Mitra tidak ditemukan" });
    res.json(mitra_lainnya);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createNewMitraLainnya = async (req, res) => {
  const { nama, nik, alamat, pekerjaan } = req.body;

  if (!nama || !nik || !alamat || !pekerjaan) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  try {
    const newMitra = await createMitraLainnya({ nama, nik, alamat, pekerjaan });
    res.status(201).json({ message: "Mitra berhasil ditambahkan", data: newMitra });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateMitraLainnyaById = async (req, res) => {
  const { id } = req.params;
  const { nama, nik, alamat, pekerjaan } = req.body;

  try {
    const updated = await updateMitraLainnya(id, { nama, nik, alamat, pekerjaan });
    if (!updated) return res.status(404).json({ message: "Mitra tidak ditemukan" });
    res.json({ message: "Mitra berhasil diperbarui", data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteMitraLainnyaById = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await deleteMitraLainnya(id);
    if (!deleted) return res.status(404).json({ message: "Mitra tidak ditemukan" });
    res.json({ message: "Mitra berhasil dihapus", data: deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getMitraSobatList,
  getMitraSobat,
  createNewMitraSobat,
  updateMitraSobatById,
  deleteMitraSobatById,
  getMitraSobatCountHandler,
  getMitraLainnyaList,
  getMitraLainnya,
  createNewMitraLainnya,
  updateMitraLainnyaById,
  deleteMitraLainnyaById
};
