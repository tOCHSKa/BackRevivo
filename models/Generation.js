const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Generation = sequelize.define('Generation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  type: {
    type: DataTypes.STRING,
    validate: {
      isIn: [['restore', 'colorize', 'animate']],
    },
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },

  provider: DataTypes.STRING,

  cost: DataTypes.DECIMAL,

  is_free: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

}, {
  tableName: 'generations',
  timestamps: true,
});

module.exports = Generation;