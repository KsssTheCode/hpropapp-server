export const RateType = (sequelize, DataTypes) => {
   const RateType = sequelize.define(
      'RateType',
      {
         rateTypeCode: {
            type: DataTypes.STRING(3),
            primaryKey: true,
            comment: '요금책정형식',
         },
         reference: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: '비고',
         },
      },
      {
         timestamps: false,
      }
   );

   RateType.associate = (models) => {
      RateType.hasMany(models.Reservation, {
         foreignKey: { name: 'rateTypeCode', allowNull: false },
         sourceKey: 'rateTypeCode',
      });
      RateType.hasMany(models.RoomRate, {
         foreignKey: { name: 'rateTypeCode', allowNull: false },
         sourceKey: 'rateTypeCode',
      });
   };

   return RateType;
};
