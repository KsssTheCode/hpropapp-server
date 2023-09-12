import { ROOM_CLEAN_STATUS, ROOM_OCCUPATION } from '../constants/constants.js';

export const Room = (sequelize, DataTypes) => {
   const Room = sequelize.define(
      'Room',
      {
         roomNumber: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            comment: '객실호수',
         },
         cleanStatus: {
            type: DataTypes.STRING(3),
            allowNull: false,
            defaultValue: ROOM_CLEAN_STATUS.DIRTY,
         },
         occupation: {
            type: DataTypes.STRING(1),
            allowNull: false,
            defaultValue: ROOM_OCCUPATION.VACANT,
         },
         changeHistory: {
            type: DataTypes.JSON,
            defaultValue: '[]',
            comment: '객실변경기록',
         },
      },
      {
         paranoid: false,
         modelName: 'Room',
      }
   );

   Room.associate = function (models) {
      Room.hasOne(models.Reservation, {
         foreignKey: { name: 'roomNumber', allowNull: true },
         sourceKey: 'roomNumber',
         onUpdate: 'SET NULL',
         onDelete: 'SET NULL',
      });

      Room.belongsTo(models.RoomType, {
         foreignKey: { name: 'roomTypeCode', allowNull: true },
         targetKey: 'roomTypeCode',
         onDelete: 'SET NULL',
         onUpdate: 'CASCADE',
      });

      Room.belongsTo(models.Floor, {
         foreignKey: { name: 'floorNumber', allowNull: false },
         targetKey: 'floorNumber',
         onUpdate: 'CASCADE',
         onDelete: 'RESTRICT',
      });
   };

   return Room;
};
