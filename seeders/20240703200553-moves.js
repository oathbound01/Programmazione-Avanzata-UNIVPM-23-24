'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('moves', [
      {//tic-tac-toe
        gameId: 1,
        player: 'player1@example.com',
        move: [1, 1], //(row, column)
        gameType: 'tic-tac-toe',
        moveDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        gameId: 1,
        player: 'player2@example.com',
        move: [1, 2],
        gameType: 'tic-tac-toe',
        moveDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        gameId: 1,
        player: 'player1@example.com',
        move: [2, 2],
        gameType: 'tic-tac-toe',
        moveDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {//tic-tac-toe-3d
        gameId: 2,
        player: 'player1@example.com',
        move: [1, 1, 1], //(row, column, depth)
        gameType: 'tic-tac-toe-3d',
        moveDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        gameId: 2,
        player: 'player2@example.com',
        move: [1, 2, 2],
        gameType: 'tic-tac-toe-3d',
        moveDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        gameId: 2,
        player: 'player1@example.com',
        move: [2, 2, 3],
        gameType: 'tic-tac-toe-3d',
        moveDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('moves', null, {});
  }
};
