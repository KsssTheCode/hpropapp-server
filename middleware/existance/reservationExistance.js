import * as existance from '../../source/js/function/existance/existanceFn.js';
import { createError } from '../../source/js/function/commonFn.js';

export const createRsvnExistance = async (req, res, next) => {
   try {
      const { roomTypeCode, numberOfGuests, rateTypeCode } = req.body;
      const isExistingRoomType = await existance.checkExistingRoomType(
         roomTypeCode
      );
      if (!isExistingRoomType) throw createError(400, '존재하지 않는 객실타입');

      existance.checkNumberOfGuestsInRange(isExistingRoomType, numberOfGuests);

      const isExistingRateType = await existance.checkExistingRateType(
         rateTypeCode
      );

      if (!isExistingRateType)
         throw createError(400, '존재하지 않는 요금책정형식');
      next();
   } catch (err) {
      next(err);
   }
};

export const getRsvnsInOptionsExistance = async (req, res, next) => {
   try {
      const {
         roomTypeCodes,
         rateTypeCodes,
         createStaff,
         checkInStaff,
         checkOutStaff,
      } = req.body;

      if (roomTypeCodes) {
         for await (let code of roomTypeCodes) {
            const isExistingRoomType = await existance.checkExistingRoomType(
               code
            );
            if (!isExistingRoomType)
               throw createError(400, '존재하지 않는 객실타입코드');
         }
      }

      if (rateTypeCodes) {
         for await (let code of rateTypeCodes) {
            const isExistingRateType = await existance.checkExistingRateType(
               code
            );
            if (!isExistingRateType)
               throw createError(400, '존재하지 않는 객실타입코드');
         }
      }

      if (createStaff) {
         const isExistingStaff = existance.checkExistingStaff(createStaff);
         if (!isExistingStaff) throw createError(400, '존재하지 않는 직원');
      }
      if (checkInStaff) {
         const isExistingStaff = existance.checkExistingStaff(checkInStaff);
         if (!isExistingStaff) throw createError(400, '존재하지 않는 직원');
      }
      if (checkOutStaff) {
         const isExistingStaff = existance.checkExistingStaff(checkOutStaff);
         if (!isExistingStaff) throw createError(400, '존재하지 않는 직원');
      }
      next();
   } catch (err) {
      next(err);
   }
};

export const editStatusOnlyExistance = async (req, res, next) => {
   try {
      const { rsvnId, newStatus } = req.body;
      const isExistingRsvn = await existance.checkExistingRsvn(rsvnId);
      if (!isExistingRsvn) throw createError(400, '존재하지 않는 에약');

      await existance.checkAvailableRsvnStatus(newStatus);

      next();
   } catch (err) {
      next(err);
   }
};

export const editRsvnExistance = async (req, res, next) => {
   try {
      const {
         rsvnId,
         statusCode,
         roomTypeCode,
         rateTypeCode,
         numbersOfGuests,
      } = req.body;
      const isExistingRsvn = await existance.checkExistingRsvn(rsvnId);
      if (!isExistingRsvn) throw createError(400, '존재하지 않는 예약');

      if (statusCode)
         await existance.checkAvailableRsvnStatus(
            'reservation',
            rsvnId,
            statusCode
         );

      if (rateTypeCode) {
         const isExistingRateType = await existance.checkExistingRateType(
            rateTypeCode
         );
         if (!isExistingRateType)
            throw createError(400, '존재하지 않는 요금책정형식');
      }

      if (roomTypeCode) {
         const isExistingRoomType = await existance.checkExistingRoomType(
            roomTypeCode
         );
         if (!isExistingRoomType)
            throw createError(400, '존재하지 않는 객실타입');
         if (numbersOfGuests)
            existance.checkNumberOfGuestsInRange(roomTypeData, numbersOfGuests);
      }

      next();
   } catch (err) {
      next(err);
   }
};

export const checkRsvnExistanceOnly = async (req, res, next) => {
   try {
      const { id } = req.query;

      const isExistingRsvn = await existance.checkExistingRsvn(id);
      if (!isExistingRsvn) throw createError(400, '존재하지 않는 예약');

      next();
   } catch (err) {
      next(err);
   }
};

export const deleteMemoExistance = async (req, res, next) => {
   try {
      await existance.checkExistingRsvn(rsvnId);
      await existance.checkExistingRsvnMemo(memoId);
      next();
   } catch (err) {
      next(err);
   }
};
