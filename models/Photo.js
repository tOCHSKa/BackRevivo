const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Photo = sequelize.define('Photo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  original_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  restored_preview_url: DataTypes.STRING,
  restored_hd_url: DataTypes.STRING,

  colorized_preview_url: DataTypes.STRING,
  colorized_hd_url: DataTypes.STRING,

  is_preview_generated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  metadata: {
    type: DataTypes.JSONB,
  },

}, {
  tableName: 'photos',
  timestamps: true,
});

module.exports = Photo;