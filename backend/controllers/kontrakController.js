const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const moment = require("moment");
moment.locale("id");

const {
  getKontrakData,
  insertKontrak,
  getAllKontrak,
  deleteKontrakById,
} = require("../models/kontrakModel");

const { getTemplateKontrakById } = require("../models/templateKontrakModel");
const { getTeknisById } = require("../models/teknisModel");

// ============================
// TERBILANG
// ============================
const terbilang = (angka) => {
  const satuan = ["","satu","dua","tiga","empat","lima","enam","tujuh","delapan","sembilan","sepuluh","sebelas"];
  angka = parseInt(angka, 10);
  if (angka < 12) return satuan[angka];
  if (angka < 20) return terbilang(angka - 10) + " belas";
  if (angka < 100) return terbilang(Math.floor(angka / 10)) + " puluh " + terbilang(angka % 10);
  if (angka < 200) return "seratus " + terbilang(angka - 100);
  if (angka < 1000) return terbilang(Math.floor(angka / 100)) + " ratus " + terbilang(angka % 100);
  if (angka < 2000) return "seribu " + terbilang(angka - 1000);
  if (angka < 1000000) return terbilang(Math.floor(angka / 1000)) + " ribu " + terbilang(angka % 1000);
  return angka.toString();
};

// ============================
// FORMAT TANGGAL
// ============================
const formatTanggalKombinasi = (tgl) =>
  `${parseInt(tgl.format("DD"))} ${tgl.format("MMMM YYYY")}`;

const sanitize = (str) => str.replace(/[\/\\:*?"<>|]/g, "_");

// ============================
// GENERATE FILE KONTRAK
// ============================
const generateKontrakFile = async (bodyData) => {
  const {
    id_pegawai,
    id_jabatan,
    id_survei,
    id_teknis,
    honor,
    tanggal_mulai,
    tanggal_selesai,
    survei_besar,
    template_id,
    alamat,
  } = bodyData;

  if (!template_id) throw new Error("Template wajib diisi");
  if (!id_pegawai || !id_jabatan || !id_survei) {
    throw new Error("Data pegawai/jabatan/survei belum lengkap");
  }
  if (!id_teknis) throw new Error("Teknis wajib diisi");
  if (!tanggal_mulai || !tanggal_selesai) {
    throw new Error("Tanggal mulai & selesai wajib diisi");
  }

  const data = await getKontrakData(id_pegawai, id_jabatan, id_survei);
  if (!data) throw new Error("Data pegawai tidak ditemukan");

  const templateData = await getTemplateKontrakById(template_id);
  if (!templateData) throw new Error("Template tidak ditemukan");

  const templatePath = path.join(process.cwd(), "uploads", templateData.file_name);
  if (!fs.existsSync(templatePath)) throw new Error("File template tidak ditemukan");

  const content = fs.readFileSync(templatePath);
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

  const tglMulai = moment(tanggal_mulai);
  const tglSelesai = moment(tanggal_selesai);

  const allKontrak = await getAllKontrak();
  const nomorUrut = allKontrak.length + 1;

  doc.render({
    NoKontrak: nomorUrut.toString().padStart(2, "0"),
    BlnAngka: tglMulai.format("MM"),
    Nu: nomorUrut.toString().padStart(2, "0"),

    Hari: tglMulai.format("dddd"),
    TglHuruf: terbilang(parseInt(tglMulai.format("DD"))),
    BlnHuruf: tglMulai.format("MMMM"),
    ThnHuruf: terbilang(parseInt(tglMulai.format("YYYY"))),

    TanggalMulai: formatTanggalKombinasi(tglMulai),
    TanggalSelesai: formatTanggalKombinasi(tglSelesai),

    Nama: data.nama,
    NamaBesar: data.nama.toUpperCase(),
    NIK: data.nip,
    Alamat: alamat || data.alamat || "",
    JabatanLengkap: data.jabatan_lengkap,
    Survei: data.nama_survei,
    SurveiBesar: survei_besar || data.nama_survei,
    Honor: honor,
    Sebagai: "sebagai",
  });

  const fileName = `${sanitize(templateData.judul_template)}_${sanitize(data.nama)}.docx`;
  const buffer = doc.getZip().generate({ type: "nodebuffer" });

  return {
    fileName,
    buffer,
    templateData,
    data,
    nomorUrut,
    id_teknis,
  };
};

// ============================
// SAVE KONTRAK (TANPA DOWNLOAD)
// ============================
const saveKontrak = async (req, res) => {
  try {
    const result = await generateKontrakFile(req.body);

    const filePath = path.join(process.cwd(), "uploads", result.fileName);
    fs.writeFileSync(filePath, result.buffer);

    let namaTeknis = result.id_teknis;
    try {
      const teknis = await getTeknisById(result.id_teknis);
      namaTeknis = teknis?.nama_teknis || result.id_teknis;
    } catch (e) {
      console.warn("⚠️ Gagal ambil teknis, pakai ID:", e.message);
    }

    const kontrak = await insertKontrak({
      judul_dokumen: `${result.templateData.judul_template} - ${result.data.nama}`,
      teknis: namaTeknis,
      jumlah: 1,
      original_template: result.templateData.original_name,
      file_name: result.fileName,
      data_json: JSON.stringify(req.body),
    });

    res.status(201).json({
      success: true,
      message: "Kontrak berhasil disimpan",
      data: {
        id: kontrak?.id || null,
        fileName: result.fileName,
      },
    });
  } catch (err) {
    console.error("❌ Save kontrak gagal:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================
// GENERATE + DOWNLOAD
// ============================
const generateKontrak = async (req, res) => {
  try {
    const result = await generateKontrakFile(req.body);

    const filePath = path.join(process.cwd(), "uploads", result.fileName);
    fs.writeFileSync(filePath, result.buffer);

    let namaTeknis = result.id_teknis;
    try {
      const teknis = await getTeknisById(result.id_teknis);
      namaTeknis = teknis?.nama_teknis || result.id_teknis;
    } catch {}

    await insertKontrak({
      judul_dokumen: `${result.templateData.judul_template} - ${result.data.nama}`,
      teknis: namaTeknis,
      jumlah: 1,
      original_template: result.templateData.original_name,
      file_name: result.fileName,
      data_json: JSON.stringify(req.body),
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${result.fileName}"`
    );
    res.send(result.buffer);
  } catch (err) {
    console.error("❌ Generate kontrak gagal:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================
// DOWNLOAD KONTRAK
// ============================
const downloadKontrak = async (req, res) => {
  const filePath = path.join(process.cwd(), "uploads", req.params.fileName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File tidak ditemukan" });
  }
  res.sendFile(filePath);
};

// ============================
// GET & DELETE
// ============================
const getAllKontrakHandler = async (req, res) => {
  const data = await getAllKontrak();
  res.json({ success: true, data });
};

const deleteKontrak = async (req, res) => {
  await deleteKontrakById(req.params.id);
  res.json({ success: true, message: "Kontrak dihapus" });
};

const getKontrakCountHandler = async (req, res) => {
  try {
    const jumlah = await getKontrakCount();
    res.json({ jumlah });
  } catch (err) {
    console.error("Gagal ambil jumlah Kontrak:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  saveKontrak,
  generateKontrak,
  downloadKontrak,
  getAllKontrak: getAllKontrakHandler,
  deleteKontrak,
  getKontrakCountHandler,
};
