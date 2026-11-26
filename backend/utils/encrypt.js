const crypto = require("crypto");
const key = process.env.AES_SECRET_KEY; 

function encrypt(text) {
  const iv = crypto.randomBytes(16); // IV (inisialisasi vector) random 16 bytes
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv); // buat cipher AES-CBC
  let encrypted = cipher.update(text, "utf8", "hex"); // enkripsi teks input ke hex
  encrypted += cipher.final("hex"); // finalisasi enkripsi
  const result = iv.toString("hex") + ":" + encrypted; // gabungkan IV dan hasil enkripsi dipisah ':'
  console.log("[encrypt] iv:", iv.toString("hex"));
  console.log("[encrypt] encrypted:", encrypted);
  return result; // hasil enkripsi siap disimpan di database
}

function decrypt(encryptedText) {
  console.log("[decrypt] input:", encryptedText);
  const [ivHex, encrypted] = encryptedText.split(":"); // pisahkan IV dan ciphertext
  if (!ivHex || !encrypted) {
    throw new Error("Format data terenkripsi tidak valid");
  }
  console.log("[decrypt] ivHex:", ivHex);
  console.log("[decrypt] encrypted:", encrypted);
  const iv = Buffer.from(ivHex, "hex"); // ubah IV dari hex ke buffer
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv); // buat decipher AES-CBC dengan IV
  let decrypted = decipher.update(encrypted, "hex", "utf8"); // dekripsi ciphertext ke utf8
  decrypted += decipher.final("utf8"); // finalisasi dekripsi
  console.log("[decrypt] decrypted:", decrypted);
  return decrypted; // hasil dekripsi (password asli)
}


module.exports = { encrypt, decrypt };
