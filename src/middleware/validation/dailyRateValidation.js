import * as validation from '../../source/js/function/validation/commonValidationFn.js';
import { rsvnDateCheck } from '../../source/js/function/validation/reservationValidationFn.js';
import { createError } from '../../source/js/function/commonFn.js';

export const getNewDailyRateValidation = (req, res, next) => {
   try {
      const { arrivalDate, departureDate, roomTypeCode, rateTypeCode, rsvnId } =
         req.body;
      validation.idCheck(rsvnId);
      if (arrivalDate || departureDate)
         rsvnDateCheck(arrivalDate, departureDate);
      if (roomTypeCode) validation.roomTypeCodeCheck(roomTypeCode);
      if (rateTypeCode) validation.rateTypeCodeCheck(rateTypeCode);
      next();
   } catch (err) {
      next(err);
   }
};

export const editSpecificRsvnDailyRateValidation = (req, res, next) => {
   try {
      const { newDailyRateDatas } = req.body;
      Array.isArray(newDailyRateDatas)
         ? newDailyRateDatas.forEach((data) => {
              validation.numberCheck(data.price);
              if (id < Number(rsvnId + '001') || id > Number(rsvnId + '999'))
                 throw createError(400, '일별요금 고유번호 입력오류');
           })
         : () => {
              throw createError(400, '변경할 일별요금 입력오류(배열이 아님');
           };
      next();
   } catch (err) {
      next(err);
   }
};
