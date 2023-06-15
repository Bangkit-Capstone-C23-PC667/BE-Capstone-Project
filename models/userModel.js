const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  umur: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  gender: {
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
    allowNull: true,
    defaultValue: 'https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar-thumbnail.png',
  },
  pekerjaan: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '-',
  },  
  asal: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '-',
  },  
  hobi: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '-',
  },
  pendidikan: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '-',
  },
});

User.associate = (models) => {
  User.hasMany(models.Kuesioner, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
};
module.exports = User;
