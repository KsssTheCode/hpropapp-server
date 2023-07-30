import moment from 'moment';

export const ReservationChangeHistory = (sequelize, DataTypes) => {
   const ReservationChangeHistory = sequelize.define(
      'ReservationChangeHistory',
      {
         changeHistoryId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         updatedProperties: {
            type: DataTypes.JSON,
            comment: '변경 전 내용',
         },
         updatedReservation: {
            type: DataTypes.JSON,
            comment: '변경 내용',
         },
         updatedTime: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: moment().format('YYYY-MM-DD HH:mm:ss'),
            comment: '변경 시간',
         },
      },
      {
         paranoid: false,
         timestamps: false,
         modelName: 'ReservationChangeHistory',
      }
   );

   ReservationChangeHistory.associate = function (models) {
      ReservationChangeHistory.belongsTo(models.Staff, {
         foreignKey: { name: 'staffId', allowNull: false },
         targetKey: 'staffId',
      });

      ReservationChangeHistory.belongsTo(models.Reservation, {
         foreignKey: { name: 'rsvnId', allowNull: true },
         targetKey: 'rsvnId',
      });

      ReservationChangeHistory.belongsTo(models.GroupReservation, {
         foreignKey: { name: 'groupRsvnId', allowNull: true },
         targetKey: 'groupRsvnId',
      });
   };

   return ReservationChangeHistory;
};
