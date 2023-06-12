'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Questions', {
      question_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,

      },
      question_type: {
        type: Sequelize.STRING,
      },
      question: {
        type: Sequelize.TEXT,
      },
      kuesioner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Kuesioners',
          key: 'kuesioner_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Questions');
  },
};
