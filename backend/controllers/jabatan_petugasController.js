const {
    getAllJabatanPetugas,
    getJabatanPetugasById,
    createJabatanPetugas,
    updateJabatanPetugas,
    deleteJabatanPetugas
} = require('../models/jabatan_petugasModel');

const getJabatanPetugasList = async (req, res) => {
    try {
        const jabatanPetugas = await getAllJabatanPetugas();
        res.json({ message: 'Success', data: jabatanPetugas });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getJabatanPetugas = async (req, res) => {
    const { id } = req.params;
    try {
        const jabatanPetugas = await getJabatanPetugasById(id);
        if (!jabatanPetugas) return res.status(404).json({ message: 'Data jabatan petugas tidak ditemukan' });
        res.json({ message: 'Success', data: jabatanPetugas });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createNewJabatanPetugas = async (req, res) => {
    const { nama_jabatan, uraian } = req.body;
    if (!nama_jabatan || !uraian) {
        return res.status(400).json({ message: 'Data tidak lengkap' });
    }
    try {
        const newJabatanPetugas = await createJabatanPetugas({ nama_jabatan, uraian });
        res.status(201).json({ message: 'Data jabatan petugas berhasil ditambahkan', data: newJabatanPetugas });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateJabatanPetugasById = async (req, res) => {
    const { id } = req.params;
    const { nama_jabatan, uraian } = req.body;
    try {
        const updated = await updateJabatanPetugas(id, { nama_jabatan, uraian });
        if (!updated) return res.status(404).json({ message: 'Data jabatan petugas tidak ditemukan' });
        res.json({ message: 'Data jabatan petugas berhasil diperbarui', data: updated });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteJabatanPetugasById = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await deleteJabatanPetugas(id);
        if (!deleted) return res.status(404).json({ message: 'Data jabatan petugas tidak ditemukan' });
        res.json({ message: 'Data jabatan petugas berhasil dihapus', data: deleted });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getJabatanPetugasList,
    getJabatanPetugas,
    createNewJabatanPetugas,
    updateJabatanPetugasById,
    deleteJabatanPetugasById
};
