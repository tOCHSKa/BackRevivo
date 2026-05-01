const { Project, Photo } = require('../models');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

exports.upload = async (req, res) => {
  let sessionId = req.headers['x-session-id'];

  if (!sessionId) {
    sessionId = uuidv4();
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const project = await Project.create({
      title: 'New',
      status: 'active',
      session_id: req.userId ? null : sessionId, // 👈 guest only
      userId: req.userId || null
    });

    const photo = await Photo.create({
      projectId: project.id,
      original_url: result.secure_url,
    });

    return res.json({
      sessionId, // 👈 toujours renvoyé
      projectId: project.id,
      photoId: photo.id,
      url: result.secure_url,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'upload failed' });

  } finally {
    if (req.file?.path) {
      fs.promises.unlink(req.file.path).catch(() => {});
    }
  }
};