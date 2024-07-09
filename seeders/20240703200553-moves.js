'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('moves', [
      {
        gameId: 1,
        player: 'user1@example.com',
        move: [1],
        gameType: 'AI',
        moveDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        gameId: 1,
        player: 'user1@example.com',
        move: [2],
        gameType: 'AI',
        moveDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        gameId: 2,
        player: 'user1@example.com',
        move: [4],
        gameType: '2D',
        moveDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        gameId: 2,
        player: 'user2@example.com',
        move: [5],
        gameType: '2D',
        moveDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        gameId: 2,
        player: 'user1@example.com',
        move: [6],
        gameType: '2D',
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
