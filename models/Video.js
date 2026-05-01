const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Video = sequelize.define('Video', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  preview_url: DataTypes.STRING,
  final_url: DataTypes.STRING,

  thumbnail_url: DataTypes.STRING,

  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
  },

  style: DataTypes.STRING,

  is_preview_generated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },

}, {
  tableName: 'videos',
  timestamps: true,
});

module.exports = Video;