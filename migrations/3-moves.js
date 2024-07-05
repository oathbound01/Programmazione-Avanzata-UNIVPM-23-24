'use strict';
/** In this file, we are creating the 'moves' table which will store
* all the moves made by players during a game.
* The table has the following fields:
**/
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('moves', {
      moveId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      gameId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'games',
          key: 'gameId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      player: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'users',
          key: 'email'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      move: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false
      },
      gameType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      moveDate: {
        type: Sequelize.DATE,
        allowNull: false
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

    //Add Forenign Key
    await queryInterface.addConstraint('moves', {
      fields: ['gameId'],
      type: 'foreign key',
      name: 'moves_gameId_fk',
      references: {
        table: 'games',
        field: 'gameId'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('moves', {
      fields: ['player'],
      type: 'foreign key',
      name: 'moves_player_fk',
      references: {
        table: 'users',
        field: 'email'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('moves', 'moves_gameId_fk');
    await queryInterface.removeConstraint('moves', 'moves_player_fk');
    await queryInterface.dropTable('moves');
  }
};
