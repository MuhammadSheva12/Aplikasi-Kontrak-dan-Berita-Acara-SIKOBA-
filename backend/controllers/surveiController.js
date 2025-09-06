const {
  getAllSurvei,
  getSurveiById,
  createSurvei,
  updateSurvei,
  deleteSurvei
} = require('../models/surveiModel');

// Get all survei
const getSurveiList = async (req, res) => {
  try {
    const survei = await getAllSurvei();
    res.json({ message: 'Success', data: survei });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get survei by ID
const getSurvei = async (req, res) => {
  const { id } = req.params;
  try {
    const survei = await getSurveiById(id);
    if (!survei) return res.status(404).json({ message: 'Data survei tidak ditemukan' });
    res.json(survei);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create survei
const createNewSurvei = async (req, res) => {
  const { nama_survei } = req.body;
  if (!nama_survei) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }
  try {
    await createSurvei({ nama_survei });
    res.status(201).json({ message: 'Data survei berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update survei
const updateSurveiById = async (req, res) => {
  const { id } = req.params;
  const { nama_survei } = req.body;
  try {
    await updateSurvei(id, { nama_survei });
    res.json({ message: 'Data survei berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete survei
const deleteSurveiById = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteSurvei(id);
    res.json({ message: 'Data survei berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getSurveiList,
  getSurvei,
  createNewSurvei,
  updateSurveiById,
  deleteSurveiById,
};
