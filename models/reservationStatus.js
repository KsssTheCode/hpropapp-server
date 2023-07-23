export const ReservationStatus = (sequelize, DataTypes) => {
   const ReservationStatus = sequelize.define(
      'ReservationStatus',
      {
         statusCode: {
            type: DataTypes.STRING(2),
            primaryKey: true,
            allowNull: false,
            comment: '예약상태',
         },
         statusName: {
            type: DataTypes.STRING,
            comment: '예약상태명',
         },
      },
      {
         timestamps: false,
      }
   );

   ReservationStatus.associate = (models) => {
      ReservationStatus.hasMany(models.Reservation, {
         foreignKey: { name: 'statusCode', allowNull: false },
         sourceKey: 'statusCode',
      });
   };
   ReservationStatus.associate = (models) => {
      ReservationStatus.hasMany(models.GroupReservation, {
         foreignKey: { name: 'statusCode', allowNull: false },
         sourceKey: 'statusCode',
      });
   };

   return ReservationStatus;
};
