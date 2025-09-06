// src/app/backend/controllers/pejabatController.js
const pejabatModel = require('../models/pejabatModel');

const getPejabat = async (req, res) => {
  try {
    const data = await pejabatModel.getAllPejabat();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePejabat = async (req, res) => {
  const { id } = req.params;
  const { nama_pejabat_pembuat_komitmen, nip } = req.body;

  try {
    await pejabatModel.updatePejabatById(id, nama_pejabat_pembuat_komitmen, nip);
    res.json({ message: 'Data pejabat berhasil diperbarui' });
  } catch (err) {
    console.error('Error di updatePejabat:', err);  // <-- ini tambahan
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getPejabat,
  updatePejabat,
};
