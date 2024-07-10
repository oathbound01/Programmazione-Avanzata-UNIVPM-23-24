'use strict';
/** In this file, we are creating the 'games'.
* The table has the following fields:
**/
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('games', {
      gameId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      player1: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'users',
          key: 'email'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      player2: {
        type: Sequelize.STRING,
        allowNull: false
        //references: {
        //  model: 'users',
        //  key: 'email'
        //},
        //onUpdate: 'CASCADE',
        //onDelete: 'CASCADE'
      },
      startTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      turnTime: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      currentTurn: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gameMode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gameState: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
      },
      winner: {
        type: Sequelize.STRING,
        defaultValue: "IN PROGRESS"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('games');
  }
};
