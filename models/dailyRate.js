export const DailyRate = (sequelize, DataTypes) => {
   const DailyRate = sequelize.define(
      'DailyRate',
      {
         dailyRateId: {
            primaryKey: true,
            type: DataTypes.STRING(13),
         },
         date: {
            type: DataTypes.STRING(8),
            allowNull: false,
            comment: '날짜',
         },
         price: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: '객실 가격',
         },
         // changeHistory: {
         //    type: DataTypes.JSON,
         //    defaultValue: [],
         //    comment: '변경기록',
         // },
      }
      // {
      //    paranoid: true,
      // hooks: {
      //    afterUpdate: async (dailyRate, options) => {
      //       if (dailyRate.price !== dailyRate.previous('price')) {
      //          const historyMessage = `${
      //             dailyRate.date
      //          }: ${dailyRate.previous('price')} >> ${dailyRate.price}`;

      //          const newHistory = {
      //             historyMessage,
      //             editor: '230525001',
      //             updateTime: new Date().getTime(),
      //          };

      //          await db.models.DailyRate.update(
      //             {
      //                changeHistory: db.Sequelize.fn(
      //                   'JSON_ARRAY_APPEND',
      //                   db.Sequelize.col('changeHistory'),
      //                   '$',
      //                   JSON.stringify(newHistory)
      //                ),
      //             },
      //             {
      //                where: { dailyRateId: dailyRate.dailyRateId },
      //                transaction: options.transaction,
      //                hooks: false,
      //             }
      //          ).catch(() => {
      //             throw createError(
      //                500,
      //                '회원변경기록 수정 중 DB에서 오류발생'
      //             );
      //          });

      //          const rsvn = await db.models.Reservation.update(
      //             {
      //                changeHistory: db.Sequelize.fn(
      //                   'JSON_ARRAY_APPEND',
      //                   db.Sequelize.col('changeHistory'),
      //                   '$',
      //                   JSON.stringify(newHistory)
      //                ),
      //             },
      //             {
      //                where: { rsvnId: dailyRate.rsvnId },
      //                transaction: options.transaction,
      //                hooks: false,
      //                returning: true,
      //             }
      //          );

      //          if (rsvn.groupRsvnId) {
      //          }
      //       }
      //    },
      // },
      // }
   );

   DailyRate.associate = (models) => {
      DailyRate.belongsTo(models.Reservation, {
         foreignKey: { name: 'rsvnId', allowNull: true },
         targetKey: 'rsvnId',
      });
      // DailyRate.belongsTo(models.RoomRate, {
      //    foreignKey: { name: 'roomRateId', allowNull: false },
      //    targetKey: 'roomRateId',
      // });
   };

   return DailyRate;
};
