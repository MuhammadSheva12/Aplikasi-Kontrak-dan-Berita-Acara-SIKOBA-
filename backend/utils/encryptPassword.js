require('dotenv').config(); 
const { encrypt } = require('./encrypt');

function encryptPassword(plainPassword) {
  try {
    const encrypted = encrypt(plainPassword);
    return encrypted;
  } catch (error) {
    console.error('❌ Error encrypting password:', error.message);
    return null;
  }
}

if (require.main === module) {
  const password = 'sheva123';
  encryptPassword(password);
   console.log("Encrypted password:", encrypted);
}

module.exports = { encryptPassword };
