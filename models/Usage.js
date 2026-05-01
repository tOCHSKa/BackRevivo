const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Usage = sequelize.define('Usage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  action: DataTypes.STRING,

  is_free: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  credits_used: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

}, {
  tableName: 'usages',
  timestamps: true,
});

module.exports = Usage;