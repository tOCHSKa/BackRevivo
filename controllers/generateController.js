// const { Generation } = require('../models');
const { Photo } = require('../models');
const replicateService = require('../services/replicateService');


exports.generatePreview = async (req, res) => {
  try {
    const { photoId } = req.body;

    const photo = await Photo.findByPk(photoId);

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

  console.log("🧠 Calling IA...");

  const output = await replicateService.restoreImage(photo.original_url);

  console.log("Output:", output);

    const restoredUrl =
      typeof output.url === "string"
        ? output.url
        : output.url?.href;

    await photo.update({
      restored_preview_url: restoredUrl,
      is_preview_generated: true
    });

    res.json({
      restored_preview_url: restoredUrl
    });

  } catch (err) {
    console.error("❌ ERROR generatePreview:", err);

    res.status(500).json({
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};
