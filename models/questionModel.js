const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const Kuesioner = require('./kuesionerModel');

const Question = sequelize.define('Question', {
  question_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  question_type: {
    type: DataTypes.STRING,
  },
  question: {
    type: DataTypes.TEXT,
  },
  kuesioner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Kuesioner.hasMany(Question, { foreignKey: 'kuesioner_id' });
Question.belongsTo(Kuesioner, { foreignKey: 'kuesioner_id' });

module.exports = Question;
