const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: DataTypes.STRING,
  session_id: DataTypes.STRING,
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active',
  },
  cover_photo_id: {
    type: DataTypes.UUID,
  },
}, {
  tableName: 'projects',
  timestamps: true,
});

module.exports = Project;