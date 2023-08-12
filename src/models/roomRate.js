export const RoomRate = (sequelize, DataTypes) => {
   const RoomRate = sequelize.define(
      'RoomRate',
      {
         roomRateId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
         },
         price: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: '가격',
         },
         date: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: '날짜',
         },
      },
      {
         indexes: [
            { unique: true, fields: ['rateTypeCode', 'roomTypeCode', 'date'] },
         ],
      }
   );

   RoomRate.associate = (models) => {
      RoomRate.belongsTo(models.RateType, {
         foreignKey: { name: 'rateTypeCode', allowNull: false },
         targetKey: 'rateTypeCode',
      });
      RoomRate.belongsTo(models.RoomType, {
         foreignKey: { name: 'roomTypeCode', allowNull: false },
         targetKey: 'roomTypeCode',
      });
      // RoomRate.hasMany(models.DailyRate, {
      //    foreignKey: { name: 'roomRateId', allowNull: false },
      //    sourceKey: 'roomRateId',
      // });
   };

   return RoomRate;
};
