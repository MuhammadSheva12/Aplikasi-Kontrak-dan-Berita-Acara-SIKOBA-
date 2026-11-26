const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const moment = require("moment");
moment.locale("id");

const {
  getBastData,
  insertBast,
  getAllBast,
  deleteBastById,
} = require("../models/bastModel");

const { getTemplateBastById } = require("../models/templateBastModel");

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

const sanitize = (str) => str.replace(/[\/\\:*?"<>|]/g, "_");

// ============================
// GENERATE FILE BAST
// ============================
const generateBastFile = async (body) => {
  const {
    id_pegawai,
    id_jabatan,
    id_survei,
    template_id,
    tanggal_bast,

    realisasi,
    target,
    satuan,
    bentuk,
    catatan,
  } = body;

  if (!template_id) throw new Error("Template BAST wajib diisi");
  if (!id_pegawai || !id_jabatan || !id_survei) {
    throw new Error("Data pegawai/jabatan/survei belum lengkap");
  }

  const data = await getBastData(id_pegawai, id_jabatan, id_survei);
  if (!data) throw new Error("Data pegawai tidak ditemukan");

  const template = await getTemplateBastById(template_id);
  if (!template) throw new Error("Template BAST tidak ditemukan");

  const templatePath = path.join(process.cwd(), "uploads", template.file_name);
  if (!fs.existsSync(templatePath)) {
    throw new Error("File template BAST tidak ditemukan");
  }

  const content = fs.readFileSync(templatePath);
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

  const tgl = tanggal_bast ? moment(tanggal_bast) : moment();

  const allBast = await getAllBast();
  const nomorUrut = allBast.length + 1;

  doc.render({
    NamaSurveiBesar: data.nama_survei.toUpperCase(),

    NoBAST: nomorUrut.toString().padStart(2, "0"),
    BlnAngka: tgl.format("MM"),
    Nu: nomorUrut.toString().padStart(2, "0"),

    Hari: tgl.format("dddd"),
    TglHuruf: terbilang(tgl.format("DD")),
    BlnHuruf: tgl.format("MMMM"),
    ThnHuruf: terbilang(tgl.format("YYYY")),

    Nama: data.nama,
    NamaBesar: data.nama.toUpperCase(),
    NIK: data.nip,
    Alamat: data.alamat || "",

    Sebagai: "sebagai",
    Survei: data.nama_survei,

    Realisasi: realisasi || "0",
    Target: target || "0",
    Satuan: satuan || "dokumen",
    Bentuk: bentuk || "dokumen",

    Catatan: catatan || "-",
  });

  const fileName = `${sanitize(template.judul_template)}_${Date.now()}.docx`;
  const buffer = doc.getZip().generate({ type: "nodebuffer" });

  return {
    fileName,
    buffer,
    template,
    data,
  };
};

// ============================
// SAVE BAST (TANPA DOWNLOAD)
// ============================
const saveBast = async (req, res) => {
  try {
    const result = await generateBastFile(req.body);

    const filePath = path.join(process.cwd(), "uploads", result.fileName);
    fs.writeFileSync(filePath, result.buffer);

    const bast = await insertBast({
      judul_dokumen: `${result.template.judul_template} - ${result.data.nama}`,
      jumlah: 1,
      original_template: result.template.original_name,
      file_name: result.fileName,
      data_json: JSON.stringify(req.body),
    });

    res.status(201).json({
      success: true,
      message: "BAST berhasil disimpan",
      data: {
        id: bast?.id || null,
        fileName: result.fileName,
      },
    });
  } catch (err) {
    console.error("❌ Save BAST gagal:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================
// GENERATE + DOWNLOAD
// ============================
const generateBast = async (req, res) => {
  try {
    const result = await generateBastFile(req.body);

    const filePath = path.join(process.cwd(), "uploads", result.fileName);
    fs.writeFileSync(filePath, result.buffer);

    await insertBast({
      judul_dokumen: `${result.template.judul_template} - ${result.data.nama}`,
      jumlah: 1,
      original_template: result.template.original_name,
      file_name: result.fileName,
      data_json: JSON.stringify(req.body),
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${result.fileName}"`
    );
    res.send(result.buffer);
  } catch (err) {
    console.error("❌ Generate BAST gagal:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================
// DOWNLOAD BAST
// ============================
const downloadBast = async (req, res) => {
  const filePath = path.join(process.cwd(), "uploads", req.params.fileName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File tidak ditemukan" });
  }
  res.sendFile(filePath);
};

// ============================
// GET & DELETE
// ============================
const getAllBastHandler = async (req, res) => {
  const data = await getAllBast();
  res.json({ success: true, data });
};

const deleteBast = async (req, res) => {
  await deleteBastById(req.params.id);
  res.json({ success: true, message: "BAST dihapus" });
};

const getBastCountHandler = async (req, res) => {
  try {
    const jumlah = await getBastCount();
    res.json({ jumlah });
  } catch (err) {
    console.error("Gagal ambil jumlah BAST:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  saveBast,
  generateBast,
  downloadBast,
  getAllBast: getAllBastHandler,
  deleteBast,
  getBastCountHandler,
};
