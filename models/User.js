const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },

  password_hash: {
    type: DataTypes.STRING,
    allowNull: true, // null si login Google plus tard
  },

  credits: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

}, {
  tableName: 'users',
  timestamps: true, // createdAt + updatedAt
});

module.exports = User;