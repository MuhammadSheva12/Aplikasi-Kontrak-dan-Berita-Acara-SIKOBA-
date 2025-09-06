// backend/utils/encryptPassword.js
require('dotenv').config(); // Load environment variables
const { encrypt } = require('./encrypt');

// Function untuk encrypt password
function encryptPassword(plainPassword) {
  try {
    const encrypted = encrypt(plainPassword);
    console.log('='.repeat(50));
    console.log('🔐 PASSWORD ENCRYPTION RESULT');
    console.log('='.repeat(50));
    console.log('Plain Password:', plainPassword);
    console.log('Encrypted Password:', encrypted);
    console.log('='.repeat(50));
    console.log('📋 SQL Query:');
    console.log(`UPDATE data_user SET password = '${encrypted}' WHERE username = 'Wishnu Eka Saputra';`);
    console.log('='.repeat(50));
    return encrypted;
  } catch (error) {
    console.error('❌ Error encrypting password:', error.message);
    return null;
  }
}

// Encrypt password "wishnu123"
if (require.main === module) {
  const password = 'wishnu123';
  encryptPassword(password);
}

module.exports = { encryptPassword };