const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Question = require('./questionModel');

const QuestionOption = sequelize.define('QuestionOption', {
  option_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  option: {
    type: DataTypes.TEXT,
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Question.hasMany(QuestionOption, { foreignKey: 'question_id' });
QuestionOption.belongsTo(Question, { foreignKey: 'question_id' });

module.exports = QuestionOption;
