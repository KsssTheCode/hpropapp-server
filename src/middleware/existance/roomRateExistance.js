import { createError } from '../../source/js/function/commonFn.js';
import * as existance from '../../source/js/function/existance/existanceFn.js';

export const checkRateTypeAndRoomTypeExistance = async (req, res, next) => {
   try {
      const { rateTypeCodes, roomTypeCodes } = req.body;

      if (rateTypeCodes)
         for await (let rateType of rateTypeCodes) {
            const isExistingRateType =
               existance.checkExistingRateType(rateType);
            if (!isExistingRateType)
               throw createError(400, '존재하지 않는 요금책정형식');
         }
      if (roomTypeCodes)
         for await (let roomType of roomTypeCodes) {
            const isExistingRoomType =
               existance.checkExistingRoomType(roomType);
            if (!isExistingRoomType)
               throw createError(400, '존재하지 않는 객실타입');
         }

      next();
   } catch (err) {
      next(err);
   }
};

export const checkExistanceOfAllRoomRateOptions = (req, res, next) => {
   try {
      const { rateTypeCode, roomTypeCode } = req.query;

      const isExistingRateType = existance.checkExistingRateType(rateTypeCode);
      if (!isExistingRateType)
         throw createError(404, '존재하지 않는 요금책정형식');

      const isExistingRoomType = existance.checkExistingRoomType(roomTypeCode);
      if (!isExistingRoomType) throw createError(404, '존재하지 않는 객실유형');

      next();
   } catch (err) {
      next(err);
   }
};

export const editSpecificRoomRatesExistance = async (req, res, next) => {
   try {
      const { editObjects } = req.body;

      for await (const item of editObjects) {
         const { rateTypeCode, roomTypeCode } = editObjects[item];
         const isExistingRateType = await existance.checkExistingRateType(
            rateTypeCode
         );
         if (!isExistingRateType)
            throw createError(404, '존재하지 않는 요금책정형식');
         const isExistingRoomType = await existance.checkExistingRoomType(
            roomTypeCode
         );
         if (!isExistingRoomType)
            throw createError(404, '존재하지 않는 객실타입');
      }
      next();
   } catch (err) {
      next(err);
   }
};
