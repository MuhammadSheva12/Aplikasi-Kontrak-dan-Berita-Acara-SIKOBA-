const {
  getAllAktivitas,
  getAktivitasById,
  createAktivitas,
  updateAktivitas,
  deleteAktivitas
} = require('../models/aktivitasModel');

// Get all aktivitas
const getAktivitasList = async (req, res) => {
  try {
    const aktivitas = await getAllAktivitas();
    res.json({ message: 'Success', data: aktivitas });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get aktivitas by ID
const getAktivitas = async (req, res) => {
  const { id } = req.params;
  try {
    const aktivitas = await getAktivitasById(id);
    if (!aktivitas) return res.status(404).json({ message: 'Data aktivitas tidak ditemukan' });
    res.json(aktivitas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create aktivitas
const createNewAktivitas = async (req, res) => {
  const { nama_aktivitas } = req.body;
  if (!nama_aktivitas) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }
  try {
    await createAktivitas({ nama_aktivitas });
    res.status(201).json({ message: 'Data aktivitas berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update aktivitas
const updateAktivitasById = async (req, res) => {
  const { id } = req.params;
  const { nama_aktivitas } = req.body;
  try {
    await updateAktivitas(id, { nama_aktivitas });
    res.json({ message: 'Data aktivitas berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete aktivitas
const deleteAktivitasById = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteAktivitas(id);
    res.json({ message: 'Data aktivitas berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAktivitasList,
  getAktivitas,
  createNewAktivitas,
  updateAktivitasById,
  deleteAktivitasById,
};
