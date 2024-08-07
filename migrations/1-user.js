'use strict';
/** In this file, we are creating the 'users'.
* The table has the following fields:
**/
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false
      },
      credits: {
        allowNull: false,
        type: Sequelize.DECIMAL(5,2)
      },
      inGame: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
