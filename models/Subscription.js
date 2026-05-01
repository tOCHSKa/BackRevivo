const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  plan: DataTypes.STRING,
  status: DataTypes.STRING,

  stripe_customer_id: DataTypes.STRING,
  current_period_end: DataTypes.DATE,

}, {
  tableName: 'subscriptions',
  timestamps: true,
});

module.exports = Subscription;