const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const User = require('./userModel');
const Kategori = require('./kategoriModel');
const KuesionerKategori = require('./kuesionerkategoriModel');
// const Question = require('./questionModel');

const Kuesioner = sequelize.define('Kuesioner', {
  kuesioner_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  judul: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rentang_usia: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  kategori_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Kategori,
      key: 'kategori_id',
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id',
    },
  },
  rata_rata_rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5,
    },
  },
  jumlah_rating: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'https://www.interprint-services.co.uk/wp-content/uploads/2019/04/placeholder-banner.png',
  },
});

User.hasMany(Kuesioner, { foreignKey: 'user_id' });
Kuesioner.belongsTo(User, { foreignKey: 'user_id' });
Kuesioner.belongsToMany(Kategori, { through: KuesionerKategori });

module.exports = Kuesioner;
