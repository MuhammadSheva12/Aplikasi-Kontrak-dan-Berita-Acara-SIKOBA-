const {
  getAllSatuan,
  getSatuanById, 
  createSatuan,
  updateSatuan,
  deleteSatuan
} = require('../models/satuanModel');

// ✅ Get all satuan
const getSatuanList = async (req, res) => {
  try {
    const satuan = await getAllSatuan();
    res.json({ message: 'Success', data: satuan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get satuan by ID
const getSatuan = async (req, res) => {
  const { id } = req.params;
  try {
    const satuan = await getSatuanById(id);
    if (!satuan) return res.status(404).json({ message: 'Data satuan tidak ditemukan' });
    res.json({ message: 'Success', data: satuan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Create satuan
const createNewSatuan = async (req, res) => {
  const { uraian, uraian_status } = req.body;
  if (!uraian || !uraian_status) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }
  try {
    const newSatuan = await createSatuan({ uraian, uraian_status });
    res.status(201).json({ message: 'Data satuan berhasil ditambahkan', data: newSatuan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update satuan
const updateSatuanById = async (req, res) => {
  const { id } = req.params;
  const { uraian, uraian_status } = req.body;
  try {
    const updated = await updateSatuan(id, { uraian, uraian_status });
    if (!updated) return res.status(404).json({ message: 'Data satuan tidak ditemukan' });
    res.json({ message: 'Data satuan berhasil diperbarui', data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete satuan
const deleteSatuanById = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await deleteSatuan(id);
    if (!deleted) return res.status(404).json({ message: 'Data satuan tidak ditemukan' });
    res.json({ message: 'Data satuan berhasil dihapus', data: deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getSatuanList,
  getSatuan,
  createNewSatuan,
  updateSatuanById,
  deleteSatuanById
};
