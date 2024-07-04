'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('games', [
      {
        player1: 'user1@example.com',
        player2: 'user2@example.com',
        startTime: new Date(),
        turnTime: new Date(),
        currentTurn: 'user1@example.com',
        gameMode: '3D',
        status: 'IN PROGRESS',
        gameState: ['position1', 'position2', 'position3'],
        winner: 'TBD',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        player1: 'user1@example.com',
        player2: 'AI',
        startTime: new Date(),
        turnTime: new Date(),
        currentTurn: 'user1@example.com',
        gameMode: '2D',
        status: 'FINISHED',
        gameState: ['position1', 'position2', 'position3'],
        winner: 'user1@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('games', null, {});
  }
};
