import {
   beforeDestroyHook,
   beforeRestoreHook,
   // afterCreateHook,
   afterUpdateHook,
} from './groupReservation-hooks.js';

export const GroupReservation = (sequelize, DataTypes) => {
   const GroupReservation = sequelize.define(
      'GroupReservation',
      {
         groupRsvnId: {
            primaryKey: true,
            type: DataTypes.STRING(10),
         },
         reservationStatus: {
            type: DataTypes.STRING(3),
            allowNull: false,
            comment: '예약상태',
         },
         arrivalDate: {
            type: DataTypes.STRING(8),
            allowNull: false,
            comment: '투숙시작일',
         },
         departureDate: {
            type: DataTypes.STRING(8),
            allowNull: false,
            comment: '투숙종료일',
         },
         groupName: {
            type: DataTypes.STRING(30),
            allowNull: false,
            comment: '단체명',
         },
         leaderName: {
            type: DataTypes.STRING(30),
            comment: '인솔자명',
         },
         leaderTel: {
            type: DataTypes.STRING(14),
            comment: '인솔자 연락처',
         },
         reference: {
            type: DataTypes.STRING(900),
            comment: '특이사항',
         },
         companyName: {
            type: DataTypes.STRING(30),
            comment: '기업명',
         },
         companyTel: {
            type: DataTypes.STRING(14),
            comment: '기업 연락처',
         },
         companyAddress: {
            type: DataTypes.STRING(60),
            comment: '회사 주소',
         },
         callerName: {
            type: DataTypes.STRING(15),
            allowNull: true,
            comment: '예약자',
         },
         callerTel: {
            type: DataTypes.STRING(14),
            allowNull: true,
            comment: '예약자 전화번호',
         },
      },
      {
         modelName: 'GroupReservation',
         paranoid: true,
         sequelize,
      }
   );

   GroupReservation.associate = (models) => {
      GroupReservation.hasMany(models.Reservation, {
         foreignKey: { name: 'groupRsvnId', allowNull: true },
         sourceKey: 'groupRsvnId',
      });
      GroupReservation.hasMany(models.Memo, {
         foreignKey: { name: 'groupRsvnId', allowNull: true },
         sourceKey: 'groupRsvnId',
      });
      GroupReservation.hasOne(models.Folio, {
         foreignKey: { name: 'groupRsvnId', allowNull: true },
         sourceKey: 'groupRsvnId',
      });
      GroupReservation.belongsTo(models.Group, {
         foreignKey: { name: 'groupId', allowNull: true },
         targetKey: 'groupId',
         onDelete: 'NO ACTION',
         onUpdate: 'CASCADE',
      });
      GroupReservation.belongsTo(models.Staff, {
         foreignKey: { name: 'createStaffId', allowNull: false },
         targetKey: 'staffId',
         onDelete: 'NO ACTION',
      });
      GroupReservation.hasMany(models.ReservationChangeHistory, {
         foreignKey: { name: 'groupRsvnId', allowNull: true },
         sourceKey: 'groupRsvnId',
         onDelete: 'CASCADE',
         onUpate: 'CASCADE',
      });
   };

   GroupReservation.addHook('beforeDestroy', beforeDestroyHook);
   GroupReservation.addHook('beforeRestore', beforeRestoreHook);
   // GroupReservation.addHook('afterCreate', afterCreateHook);
   GroupReservation.addHook('afterUpdate', afterUpdateHook);

   return GroupReservation;
};
