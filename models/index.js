const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Example = sequelize.define('Example', {
  // Define model fields
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
  // ...add more fields as needed
});

module.exports = Example;