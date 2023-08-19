import * as existance from '../../source/js/function/existance/existanceFn.js';

export const getNewDailyRateExistance = async (req, res, next) => {
   try {
      const { roomTypeCode, rateTypeCode, rsvnId } = req.body;

      const isExistingRsvn = existance.checkExistingRsvn(rsvnId);
      if (!isExistingRsvn) throw createError(404, '존재하지 않는 예약');

      if (roomTypeCode) {
         const isExistingRoomType =
            existance.checkExistingRoomType(roomTypeCode);
         if (!isExistingRoomType)
            throw createError(404, '존재하지 않는 객실타입');
      }
      if (rateTypeCode) {
         const isExistingRateType =
            existance.checkExistingRateType(rateTypeCode);
         if (!isExistingRateType)
            throw createError(404, '존재하지 않는 객실타입');
      }
      next();
   } catch (err) {
      next(err);
   }
};

export const editSpecificRsvnDailyRateExistance = async (req, res, next) => {
   try {
      const { newDailyRateDatas } = req.body;
      for await (let data of newDailyRateDatas) {
         const rsvnId = data.dailyRateId.substr(0, 8);
         const isExistingRsvnId = await existance.checkExistingRsvn(rsvnId);
         if (!isExistingRsvnId) throw createError(404, '존재하지 않는 예약');

         const isExistingDailyRate = await existance.checkExistingDailyRate(
            data.dailyRateId
         );
         if (!isExistingDailyRate)
            throw createError(404, '존재하지 않는 일별요금');
      }
      next();
   } catch (err) {
      next(err);
   }
};
