const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const teknisRoutes = require('./routes/teknisRoutes');
const kegiatanRoutes = require('./routes/kegiatanRoutes');
const pejabatRoutes = require('./routes/pejabatRoutes');
const dipaRoutes = require('./routes/dipaRoutes');
const mitraRoutes = require('./routes/mitraRoutes');
const pegawaiRoutes = require('./routes/pegawaiRoutes');
const surveiRoutes = require('./routes/surveiRoutes');
const aktivitasRoutes = require('./routes/aktivitasRoutes');
const satuanRoutes = require('./routes/satuanRoutes'); 
const jabatan_petugasRoutes = require('./routes/jabatan_petugasRoutes');
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());

// UBAH BAGIAN INI - CORS dengan credentials
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // URL frontend Anda
  credentials: true // WAJIB untuk cookies httpOnly
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teknis', teknisRoutes);
app.use('/api/kegiatan', kegiatanRoutes);
app.use('/api/pejabat', pejabatRoutes);
app.use('/api/dipa', dipaRoutes);
app.use('/api/mitra', mitraRoutes);
app.use('/api/pegawai', pegawaiRoutes);
app.use('/api/survei', surveiRoutes);
app.use('/api/aktivitas', aktivitasRoutes);
app.use('/api/satuan', satuanRoutes); 
app.use('/api/jabatan_petugas', jabatan_petugasRoutes);

app.get("/api/bast/count", (req, res) => {
  res.json({ jumlah: 0 }); // Dummy data agar tidak 404
});

app.get("/api/kontrak/count", (req, res) => {
  res.json({ jumlah: 0 }); // Dummy data agar tidak 404
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));