const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Kategori = sequelize.define('Kategori', {
  kategori_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  kategori_nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  kategori_desc: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

Kategori.associate = (models) => {
  Kategori.belongsToMany(models.Kuesioner, {
    through: 'KuesionerKategori',
    foreignKey: 'kategori_id',
  });
};

module.exports = Kategori;
