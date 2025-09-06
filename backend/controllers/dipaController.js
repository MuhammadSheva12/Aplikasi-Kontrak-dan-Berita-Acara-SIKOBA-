const dipaModel = require('../models/dipaModel');

const getDipa = async (req, res) => {
  try {
    const data = await dipaModel.getAllDipa();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateDipa = async (req, res) => {
  const { id } = req.params;
  const { nomor_dipa, tanggal } = req.body;

  if (!nomor_dipa || !tanggal) {
    return res.status(400).json({ error: 'nomor_dipa & tanggal wajib diisi' });
  }

  try {
    const updated = await dipaModel.updateDipaById(id, nomor_dipa, tanggal);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDipa, updateDipa };
