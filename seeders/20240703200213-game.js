'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('games', [
      {
        player1: 'user1@example.com',
        player2: 'user2@example.com',
        startTime: new Date(),
        turnTime: 0,
        currentTurn: 'user1@example.com',
        gameMode: '2D',
        status: 'FINISHED',
        gameState: ['X', 'O', '', 'X', 'O', '', 'X', '', ''],
        winner: 'user1@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        player1: 'user2@example.com',
        player2: 'AI',
        startTime: new Date(),
        turnTime: 30,
        currentTurn: 'user2@example.com',
        gameMode: '2D',
        status: 'FORFEIT',
        gameState: ['', '', '', '', '', '', '', '', ''],
        winner: 'AI',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('games', null, {});
  }
};
