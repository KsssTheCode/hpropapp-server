export const Room = (sequelize, DataTypes) => {
   const Room = sequelize.define(
      'Room',
      {
         roomNumber: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            comment: '객실호수',
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
      Room.belongsTo(models.CleanStatus, {
         foreignKey: { name: 'cleanStatusCode', allowNull: true },
         targetKey: 'cleanStatusCode',
      });
      Room.belongsTo(models.RoomStatus, {
         foreignKey: { name: 'roomStatusCode', allowNull: true },
         targetKey: 'roomStatusCode',
      });
   };

   return Room;
};
