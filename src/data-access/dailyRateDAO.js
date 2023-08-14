import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';

const DailyRate = db.DailyRate;
const RoomRate = db.RoomRate;

export const getNewDailyRateDAO = async (
   roomTypeCode,
   rateTypeCode,
   rsvnId,
   date,
   number,
   transaction
) => {
   try {
      const price = await RoomRate.findOne(
         { attributes: ['price'] },
         {
            where: {
               date: date,
               roomTypeCode: roomTypeCode,
               rateTypeCode: rateTypeCode,
            },
            transaction: transaction,
            returning: true,
         }
      );

      const newDailyRate = await DailyRate.create(
         {
            dailyRateId: rsvnId.slice(1) + +number,
            date: date,
            price: price,
            rsvnId: rsvnId,
         },
         { transaction: transaction, returning: true }
      );

      return newDailyRate;
   } catch (err) {
      throw err;
   }
};

export const destoryDailyRate = async (rsvnId, transaction) => {
   try {
      await DailyRate.destroy({
         where: { rsvnId: rsvnId },
         transaction: transaction,
         force: true,
      }).catch(() => {
         throw createError(500, '기존 일별요금 삭제 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const editSpecificRsvnDailyRateDAO = async (
   newDailyRatesData,
   transaction
) => {
   try {
      const { dailyRateId, price } = data;
      const [updatedCount, updatedRows] = await DailyRate.update(
         { price },
         {
            where: { dailyRateId },
            transaction,
            returning: true,
         }
      );
      if (updatedCount > 0) {
         return updatedRows[0]; // 업데이트된 레코드 반환
      }
      return null;
   } catch (err) {
      throw err;
   }
};
