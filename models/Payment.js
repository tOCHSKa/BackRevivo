const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  amount: DataTypes.DECIMAL,

  currency: {
    type: DataTypes.STRING,
    defaultValue: 'eur',
  },

  type: DataTypes.STRING,
  status: DataTypes.STRING,

  provider: DataTypes.STRING,
  external_id: DataTypes.STRING,

}, {
  tableName: 'payments',
  timestamps: true,
});

module.exports = Payment;