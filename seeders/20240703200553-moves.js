'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('moves', [
      {//tic-tac-toe
        gameId: 1,
        player: 'user1@example.com',
        move: [1, null],
        gameType: 'AI',
        moveDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        gameId: 1,
        player: 'user1@example.com',
        move: [2, null],
        gameType: 'AI',
        moveDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {//tic-tac-toe-3d
        gameId: 2,
        player: 'user1@example.com',
        move: [2, 2], 
        gameType: '3D',
        moveDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        gameId: 2,
        player: 'user2@example.com',
        move: [4, 2],
        gameType: '3D',
        moveDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        gameId: 2,
        player: 'user1@example.com',
        move: [2, 3],
        gameType: '3D',
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
