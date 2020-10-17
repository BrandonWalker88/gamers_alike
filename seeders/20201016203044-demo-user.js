'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {user_name: "Gamer1", createdAt: new Date(), updatedAt: new Date()},
      {user_name: "Gamer2", createdAt: new Date(), updatedAt: new Date()},
      {user_name: "Gamer3", createdAt: new Date(), updatedAt: new Date()},
      {user_name: "Gamer4", createdAt: new Date(), updatedAt: new Date()},
      {user_name: "Gamer5", createdAt: new Date(), updatedAt: new Date()},
      {user_name: "Gamer6", createdAt: new Date(), updatedAt: new Date()},
      {user_name: "Gamer7", createdAt: new Date(), updatedAt: new Date()},
      {user_name: "Gamer8", createdAt: new Date(), updatedAt: new Date()},
      {user_name: "Gamer9", createdAt: new Date(), updatedAt: new Date()},
      {user_name: "Gamer10", createdAt: new Date(), updatedAt: new Date()},
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
