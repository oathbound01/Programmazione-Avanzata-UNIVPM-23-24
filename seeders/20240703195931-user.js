'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        email: 'user1@example.com',
        password: 'password1',
        role: 'admin',
        token: 123456789,
        inGame: true
      },
      {
        email: 'user2@example.com',
        password: 'password2',
        role: 'user',
        token: 987654321,
        inGame: false
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
