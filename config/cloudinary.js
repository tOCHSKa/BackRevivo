const cloudinary = require('cloudinary').v2;

cloudinary.config({
  secure: true, // optionnel mais recommandé
});

module.exports = cloudinary;