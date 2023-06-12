const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Question = require('./questionModel');
const User = require('./userModel');
const Kuesioner = require('./kuesionerModel');

const Answer = sequelize.define('Answer', {
  answer_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  answer: {
    type: DataTypes.TEXT,
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Answer.belongsTo(Question, { foreignKey: 'question_id' });
Answer.belongsTo(Kuesioner, { foreignKey: 'kuesioner_id' });
Answer.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Answer;
