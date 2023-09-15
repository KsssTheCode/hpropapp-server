import { RSVN_STATUS } from '../constants/constants.js';
import {
   afterDestroyHook,
   beforeRestoreHook,
   afterCreateHook,
   afterUpdateHook,
} from './reservation-hooks.js';

export const Reservation = (sequelize, DataTypes) => {
   const Reservation = sequelize.define(
      'Reservation',
      {
         rsvnId: {
            primaryKey: true,
            type: DataTypes.STRING(10),
         },
         statusCode: {
            type: DataTypes.STRING(3),
            allowNull: false,
            defaultValue: RSVN_STATUS.RESERVED,
            comment: '예약상태',
         },
         arrivalDate: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '투숙시작일',
         },
         departureDate: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: '투숙종료일',
         },
         numberOfGuests: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 2,
            comment: '투숙인원',
         },
         guestName: {
            type: DataTypes.STRING(30),
            allowNull: false,
            comment: '고객명',
         },
         tel1: {
            type: DataTypes.STRING(14),
            comment: '연락처1',
         },
         tel2: {
            type: DataTypes.STRING(14),
            comment: '연락처2',
         },
         caller: {
            type: DataTypes.STRING(15),
            comment: '예약자명',
         },
         callerTel: {
            type: DataTypes.STRING(14),
            comment: '예약자 연락처',
         },
         arrivalTime: {
            type: DataTypes.STRING(4),
            comment: '입실예정시간',
         },
         departureTime: {
            type: DataTypes.STRING(4),
            comment: '퇴실예정시간',
         },
         reference: {
            type: DataTypes.STRING(900),
            comment: '특이사항',
         },
      },
      {
         sequelize,
         modelName: 'Reservation',
         paranoid: true,
      }
   );

   Reservation.associate = (models) => {
      Reservation.belongsTo(models.RoomType, {
         foreignKey: { name: 'roomTypeCode', allowNull: false },
         targetKey: 'roomTypeCode',
         onDelete: 'SET NULL',
         onUpdate: 'CASCADE',
      });
      Reservation.belongsTo(models.Room, {
         foreignKey: { name: 'roomNumber', allowNull: true },
         targetKey: 'roomNumber',
         onUpdate: 'SET NULL',
         onDelete: 'SET NULL',
      });
      Reservation.belongsTo(models.Staff, {
         foreignKey: { name: 'createStaffId', allowNull: false },
         targetKey: 'staffId',
         onDelete: 'NO ACTION',
      });
      Reservation.belongsTo(models.RateType, {
         foreignKey: { name: 'rateTypeCode', allowNull: false },
         targetKey: 'rateTypeCode',
      });
      Reservation.belongsTo(models.Member, {
         foreignKey: { name: 'memberId', allowNull: true },
         targetKey: 'memberId',
         onDelete: 'NO ACTION',
         onUpdate: 'CASCADE',
      });
      Reservation.belongsTo(models.GroupReservation, {
         foreignKey: { name: 'groupRsvnId', allowNull: true },
         targetKey: 'groupRsvnId',
         onDelete: 'CASCADE',
         onUpdate: 'CASCADE',
      });
      Reservation.hasOne(models.Folio, {
         foreignKey: { name: 'rsvnId', allowNull: true },
         sourceKey: 'rsvnId',
      });
      Reservation.hasMany(models.DailyRate, {
         foreignKey: { name: 'rsvnId', allowNull: false },
         sourceKey: 'rsvnId',
      });
      Reservation.hasMany(models.Memo, {
         foreignKey: { name: 'rsvnId', allowNull: true },
         sourceKey: 'rsvnId',
      });
      Reservation.hasMany(models.ReservationChangeHistory, {
         foreignKey: { name: 'rsvnId', allowNull: true },
         sourceKey: 'rsvnId',
         onDelete: 'CASCADE',
         onUpate: 'CASCADE',
      });
   };

   Reservation.addHook('afterDestroy', afterDestroyHook);
   Reservation.addHook('beforeRestore', beforeRestoreHook);
   Reservation.addHook('afterCreate', afterCreateHook);
   Reservation.addHook('afterUpdate', afterUpdateHook);

   return Reservation;
};
