const {
  getAllTeknis,
  getTeknisById,
  createTeknis,
  updateTeknis,
  deleteTeknis
} = require('../models/teknisModel');

// Get all teknis
const getTeknisList = async (req, res) => {
  try {
    const teknis = await getAllTeknis();
    res.json({ message: 'Success', data: teknis });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get teknis by ID
const getTeknis = async (req, res) => {
  const { id } = req.params;
  try {
    const teknis = await getTeknisById(id);
    if (!teknis) return res.status(404).json({ message: 'Data teknis tidak ditemukan' });
    res.json({ message: 'Success', data: teknis });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create teknis
const createNewTeknis = async (req, res) => {
  const { nama_teknis, kode_teknis } = req.body;
  if (!nama_teknis || !kode_teknis) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }
  try {
    const newTeknis = await createTeknis({ nama_teknis, kode_teknis });
    res.status(201).json({ message: 'Data teknis berhasil ditambahkan', data: newTeknis });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update teknis
const updateTeknisById = async (req, res) => {
  const { id } = req.params;
  const { nama_teknis, kode_teknis } = req.body;
  try {
    const updated = await updateTeknis(id, { nama_teknis, kode_teknis });
    if (!updated) return res.status(404).json({ message: 'Data teknis tidak ditemukan' });
    res.json({ message: 'Data teknis berhasil diperbarui', data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete teknis
const deleteTeknisById = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await deleteTeknis(id);
    if (!deleted) return res.status(404).json({ message: 'Data teknis tidak ditemukan' });
    res.json({ message: 'Data teknis berhasil dihapus', data: deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTeknisList,
  getTeknis,
  createNewTeknis,
  updateTeknisById,
  deleteTeknisById,
};
