import db from '../models/index.js';
import { Op } from 'sequelize';
import moment from 'moment';
import { createError } from '../source/js/function/commonFn.js';

export const systemClosing = async () => {
   console.log('1!!!');
   const transaction = await db.sequelize.transaction();
   try {
      await db.Reservation.update(
         { statusCode: 'NS' },
         {
            where: {
               [Op.and]: [
                  {
                     arrivalDate: moment()
                        .subtract(1, 'days')
                        .format('YYYYMMDD'),
                  },
                  { statusCode: 'RR' },
               ],
            },
            transaction: transaction,
         }
      ).catch((err) => {
         console.log(err);
         throw createError(400, '일반 예약 마감 중 DB에서 오류 발생');
      });

      await db.Reservation.update(
         { statusCode: 'CO' },
         {
            where: {
               [Op.and]: [
                  {
                     departureDate: moment()
                        .subtract(1, 'days')
                        .format('YYYYMMDD'),
                  },
                  { statusCode: 'CI' },
               ],
            },
         }
      );

      await db.GroupReservation.update(
         { statusCode: 'NS' },
         {
            where: {
               [Op.and]: [
                  {
                     arrivalDate: moment()
                        .subtract(1, 'days')
                        .format('YYYYMMDD'),
                  },
                  { statusCode: 'RR' },
               ],
            },
            transaction: transaction,
         }
      ).catch(() => {
         throw createError('단체 예약 마감 중 DB에서 오류 발생');
      });

      await transaction.commit();
   } catch {
      await transaction.rollback();
   }
};
