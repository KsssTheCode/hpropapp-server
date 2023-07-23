'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.bulkInsert([
         { deptCode: 'HQ', deptName: '본부' },
         { deptCode: 'RM', deptName: '객실부' },
         { deptCode: 'RS', deptName: '예약부' },
         { deptCode: 'FB', deptName: '식음부' },
         { deptCode: 'FC', deptName: '시설부' },
         { deptCode: 'HK', deptName: '정비부' },
         { deptCode: 'AC', deptName: '회계부' },
         { deptCode: 'NO', deptName: '없음' },
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
