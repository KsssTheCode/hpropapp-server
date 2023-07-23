'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.bulkInsert([
         {
            roomTypeCode: 'ODD',
            roomTypeName: 'Ocean Deluxe Double',
            roomMaxPeople: 2,
            rackRate: 300000,
         },
         {
            roomTypeCode: 'OFT',
            roomTypeName: 'Ocean Family Twin',
            roomMaxPeople: 4,
            rackRate: 500000,
         },
         {
            roomTypeCode: 'ODP',
            roomTypeName: 'Ocean Deluxe Triple',
            roomMaxPeople: 3,
            rackRate: 400000,
         },
      ]);
   },

   async down(queryInterface, Sequelize) {
      /**
       * Add commands to revert seed here.
       *
       * Example:
       * await queryInterface.bulkDelete('People', null, {});
       */
   },
};
