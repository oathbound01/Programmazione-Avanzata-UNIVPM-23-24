'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        email: 'user1@example.com',
        role: 'admin',
        credits: 20.00,
        inGame: true
      },
      {
        email: 'user2@example.com',
        role: 'user',
        credits: 10.00,
        inGame: true
      },
      {
        email: 'zero@example.com',
        role: 'user',
        credits: 0.00,
        inGame: false
      }

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
