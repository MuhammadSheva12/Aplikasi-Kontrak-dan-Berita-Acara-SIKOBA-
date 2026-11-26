const {
  getAllTemplateBast,
  createTemplateBast,
  updateTemplateBast,
  deleteTemplateBast,
} = require("../models/templateBastModel");

const {
  getAllTemplateKontrak,
  createTemplateKontrak,
  updateTemplateKontrak,
  deleteTemplateKontrak,
} = require("../models/templateKontrakModel");

// ===========================
// ===== TEMPLATE BAST =======
// ===========================
const getTemplateBastList = async (req, res) => {
  try {
    const data = await getAllTemplateBast();

    const mapped = data.map((item) => ({
      ...item,
      file_url: `${req.protocol}://${req.get("host")}/uploads/${item.file_name}`,
    }));

    res.json({ message: "Success", data: mapped });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createNewTemplateBast = async (req, res) => {
  try {
    const { judul_template, pembuat } = req.body;
    const file_name = req.file ? req.file.filename : null;
    const original_name = req.file ? req.file.originalname : null;

    if (!judul_template || !pembuat || !file_name) {
      return res.status(400).json({
        message: "Judul template, pembuat, dan file wajib diisi",
      });
    }

    const newData = await createTemplateBast({
      judul_template,
      pembuat,
      file_name,
      original_name,
    });

    res.status(201).json({
      message: "Template BAST berhasil ditambahkan",
      data: newData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const editTemplateBast = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul_template, pembuat } = req.body;
    const file_name = req.file ? req.file.filename : null;
    const original_name = req.file ? req.file.originalname : null;

    const updated = await updateTemplateBast(id, {
      judul_template,
      pembuat,
      file_name,
      original_name,
    });

    if (!updated) {
      return res.status(404).json({ message: "Template BAST tidak ditemukan" });
    }

    res.json({
      message: "Template BAST berhasil diperbarui",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeTemplateBast = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteTemplateBast(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Template BAST tidak ditemukan",
      });
    }

    res.json({
      message: "Template BAST berhasil dihapus",
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================
// ===== TEMPLATE KONTRAK =====
// ============================
const getTemplateKontrakList = async (req, res) => {
  try {
    const data = await getAllTemplateKontrak();

    const mapped = data.map((item) => ({
      ...item,
      file_url: `${req.protocol}://${req.get("host")}/uploads/${item.file_name}`,
    }));

    res.json({ message: "Success", data: mapped });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createNewTemplateKontrak = async (req, res) => {
  try {
    const { judul_template, pembuat } = req.body;
    const file_name = req.file ? req.file.filename : null;
    const original_name = req.file ? req.file.originalname : null;

    if (!judul_template || !pembuat || !file_name) {
      return res.status(400).json({
        message: "Judul template, pembuat, dan file wajib diisi",
      });
    }

    const newData = await createTemplateKontrak({
      judul_template,
      pembuat,
      file_name,
      original_name,
    });

    res.status(201).json({
      message: "Template Kontrak berhasil ditambahkan",
      data: newData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const editTemplateKontrak = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul_template, pembuat } = req.body;
    const file_name = req.file ? req.file.filename : null;
    const original_name = req.file ? req.file.originalname : null;

    const updated = await updateTemplateKontrak(id, {
      judul_template,
      pembuat,
      file_name,
      original_name,
    });

    if (!updated) {
      return res.status(404).json({ message: "Template Kontrak tidak ditemukan" });
    }

    res.json({
      message: "Template Kontrak berhasil diperbarui",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeTemplateKontrak = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteTemplateKontrak(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Template Kontrak tidak ditemukan",
      });
    }

    res.json({
      message: "Template Kontrak berhasil dihapus",
      data: deleted,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  // BAST
  getTemplateBastList,
  createNewTemplateBast,
  editTemplateBast,
  removeTemplateBast,

  // KONTRAK
  getTemplateKontrakList,
  createNewTemplateKontrak,
  editTemplateKontrak,
  removeTemplateKontrak,
};
