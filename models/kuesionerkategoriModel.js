const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const KuesionerKategori = sequelize.define('KuesionerKategori', {
  kuesionerkategori_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  kuesioner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  kategori_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = KuesionerKategori;
