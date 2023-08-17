import moment from 'moment';

export const CustomerChangeHistory = (sequelize, DataTypes) => {
   const CustomerChangeHistory = sequelize.define(
      'CustomerChangeHistory',
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
      }
   );

   CustomerChangeHistory.associate = function (models) {
      CustomerChangeHistory.belongsTo(models.Staff, {
         foreignKey: { name: 'staffId', allowNull: false },
         targetKey: 'staffId',
      });

      CustomerChangeHistory.belongsTo(models.Member, {
         foreignKey: { name: 'memberId', allowNull: true },
         targetKey: 'memberId',
      });

      CustomerChangeHistory.belongsTo(models.Group, {
         foreignKey: { name: 'groupId', allowNull: true },
         targetKey: 'groupId',
      });
   };

   return CustomerChangeHistory;
};
