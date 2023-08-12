import * as existance from '../../source/js/function/existance/existanceFn.js';

export const getNewDailyRateExistance = async (req, res, next) => {
   try {
      const { roomTypeCode, rateTypeCode, rsvnId } = req.body;

      const isExistingRsvn = existance.checkExistingRsvn(rsvnId);
      if (!isExistingRsvn) throw createError(400, '존재하지 않는 예약');

      if (roomTypeCode) {
         const isExistingRoomType =
            existance.checkExistingRoomType(roomTypeCode);
         if (!isExistingRoomType)
            throw createError(400, '존재하지 않는 객실타입');
      }
      if (rateTypeCode) {
         const isExistingRateType =
            existance.checkExistingRateType(rateTypeCode);
         if (!isExistingRateType)
            throw createError(400, '존재하지 않는 객실타입');
      }
      next();
   } catch (err) {
      next(err);
   }
};

export const editSpecificRsvnDailyRateExistance = async (req, res, next) => {
   try {
      const { newDailyRateDatas } = req.body;
      for await (const data of newDailyRateDatas) {
         const isExistingDailyRate = await existance.checkExistingDailyRate(
            data.dailyRateId
         );
         if (!isExistingDailyRate)
            throw createError(400, '존재하지 않는 일별요금');
      }
      next();
   } catch (err) {
      next(err);
   }
};
