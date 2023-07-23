export const RoomStatus = (sequelize, DataTypes) => {
   const RoomStatus = sequelize.define(
      'RoomStatus',
      {
         roomStatusCode: {
            type: DataTypes.STRING(2),
            primaryKey: true,
            allowNull: false,
            comment: '객실상태코드(배정,미배정,입실)',
         },
         statusName: {
            type: DataTypes.STRING,
            comment: '객실상태명',
         },
         reference: {
            type: DataTypes.STRING,
            comment: '설명',
         },
      },
      {
         paranoid: true,
         createdAt: false,
      }
   );

   RoomStatus.associate = (models) => {
      RoomStatus.hasMany(models.Room, {
         foreignKey: { name: 'roomStatusCode', allowNull: true },
         sourceKey: 'roomStatusCode',
      });
   };

   return RoomStatus;
};
