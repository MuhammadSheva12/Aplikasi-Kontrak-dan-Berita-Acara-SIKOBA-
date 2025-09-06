const {
  getAllKegiatan,
  getKegiatanById,
  createKegiatan,
  updateKegiatan,
  deleteKegiatan,
} = require("../models/kegiatanModel");

// Ambil semua data kegiatan (JOIN ke teknis, aktivitas, survei)
const getKegiatanList = async (req, res) => {
  try {
    const kegiatan = await getAllKegiatan();
    res.json({ message: "Success", data: kegiatan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ambil kegiatan berdasarkan ID
const getKegiatan = async (req, res) => {
  const { id } = req.params;
  try {
    const kegiatan = await getKegiatanById(id);
    if (!kegiatan) return res.status(404).json({ message: "Kegiatan tidak ditemukan" });
    res.json(kegiatan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tambah data kegiatan baru
const createNewKegiatan = async (req, res) => {
  const { teknis_id, aktivitas_id, survei_id } = req.body;

  if (!teknis_id || !aktivitas_id || !survei_id) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  try {
    await createKegiatan({ teknis_id, aktivitas_id, survei_id });
    res.status(201).json({ message: "Kegiatan berhasil ditambahkan" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update kegiatan berdasarkan ID
const updateKegiatanById = async (req, res) => {
  const { id } = req.params;
  const { teknis_id, aktivitas_id, survei_id } = req.body;

  try {
    const existing = await getKegiatanById(id);
    if (!existing) return res.status(404).json({ message: "Kegiatan tidak ditemukan" });

    await updateKegiatan(id, { teknis_id, aktivitas_id, survei_id });
    res.json({ message: "Kegiatan berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Hapus kegiatan berdasarkan ID
const deleteKegiatanById = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await getKegiatanById(id);
    if (!existing) return res.status(404).json({ message: "Kegiatan tidak ditemukan" });

    await deleteKegiatan(id);
    res.json({ message: "Kegiatan berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /teknis - ambil semua data teknis
const getTeknisList = async (req, res) => {
  try {
    const teknis = await getAllTeknis();
    res.json(teknis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /aktivitas - ambil semua data aktivitas
const getAktivitasList = async (req, res) => {
  try {
    const aktivitas = await getAllAktivitas();
    res.json(aktivitas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /survei - ambil semua data survei
const getSurveiList = async (req, res) => {
  try {
    const survei = await getAllSurvei();
    res.json(survei);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  getKegiatanList,
  getKegiatan,
  createNewKegiatan,
  updateKegiatanById,
  deleteKegiatanById,
  getTeknisList,
  getAktivitasList,
  getSurveiList,
};

