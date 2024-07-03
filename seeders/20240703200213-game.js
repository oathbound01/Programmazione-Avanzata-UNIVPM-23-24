'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('games', [
      {
        player1: 'player1@example.com',
        player2: 'player2@example.com',
        startTime: new Date(),
        turnTime: new Date(),
        currentTurn: 'player1',
        gameMode: 'multiplayer',
        status: 'in progress',
        gameState: ['position1', 'position2', 'position3'],
        winner: 'The game is not finished',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        player1: 'player3@example.com',
        player2: 'player4@example.com',
        startTime: new Date(),
        turnTime: new Date(),
        currentTurn: 'player3',
        gameMode: 'multiplayer',
        status: 'finished',
        gameState: ['position1', 'position2', 'position3'],
        winner: 'player3@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('games', null, {});
  }
};
