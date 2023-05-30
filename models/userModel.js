const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  umur: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pekerjaan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  confirm_password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  poin: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: 'https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar-thumbnail.png',
  },
});

module.exports = User;
