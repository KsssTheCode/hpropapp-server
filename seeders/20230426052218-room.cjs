'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.bulkInsert([
         { roomNumber: 1001, roomTypeCode: 'ODD' },
         { roomNumber: 1002, roomTypeCode: 'ODD' },
         { roomNumber: 1003, roomTypeCode: 'ODD' },
         { roomNumber: 1004, roomTypeCode: 'ODD' },
         { roomNumber: 1005, roomTypeCode: 'ODD' },
         { roomNumber: 1006, roomTypeCode: 'ODD' },
         { roomNumber: 1007, roomTypeCode: 'ODD' },
         { roomNumber: 1008, roomTypeCode: 'ODD' },
         { roomNumber: 1009, roomTypeCode: 'ODD' },
         { roomNumber: 1010, roomTypeCode: 'ODD' },
         { roomNumber: 2001, roomTypeCode: 'OFT' },
         { roomNumber: 2002, roomTypeCode: 'OFT' },
         { roomNumber: 2003, roomTypeCode: 'OFT' },
         { roomNumber: 2004, roomTypeCode: 'OFT' },
         { roomNumber: 2005, roomTypeCode: 'OFT' },
         { roomNumber: 2006, roomTypeCode: 'OFT' },
         { roomNumber: 2007, roomTypeCode: 'OFT' },
         { roomNumber: 2008, roomTypeCode: 'OFT' },
         { roomNumber: 2009, roomTypeCode: 'OFT' },
         { roomNumber: 2010, roomTypeCode: 'OFT' },
         { roomNumber: 3001, roomTypeCode: 'ODP' },
         { roomNumber: 3002, roomTypeCode: 'ODP' },
         { roomNumber: 3003, roomTypeCode: 'ODP' },
         { roomNumber: 3004, roomTypeCode: 'ODP' },
         { roomNumber: 3005, roomTypeCode: 'ODP' },
         { roomNumber: 3006, roomTypeCode: 'ODP' },
         { roomNumber: 3007, roomTypeCode: 'ODP' },
         { roomNumber: 3008, roomTypeCode: 'ODP' },
         { roomNumber: 3009, roomTypeCode: 'ODP' },
         { roomNumber: 3010, roomTypeCode: 'ODP' },
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
