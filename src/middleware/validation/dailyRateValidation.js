import * as validation from '../../source/js/function/validation/commonValidationFn.js';
import { createError } from '../../source/js/function/commonFn.js';

export const getNewDailyRateValidation = (req, res, next) => {
   try {
      const { arrivalDate, departureDate, roomTypeCode, rateTypeCode, rsvnId } =
         req.query;
      validation.idCheck(rsvnId);

      validation.dateCheck(arrivalDate);
      validation.dateCheck(departureDate);
      validation.rsvnDateCheck(arrivalDate, departureDate);

      if (roomTypeCode) validation.roomTypeCodeCheck(roomTypeCode);
      if (rateTypeCode) validation.rateTypeCodeCheck(rateTypeCode);
      next();
   } catch (err) {
      next(err);
   }
};

export const editSpecificRsvnDailyRateValidation = (req, res, next) => {
   try {
      const { newDailyRatesData } = req.body;
      if (Array.isArray(newDailyRatesData)) {
         if (newDailyRatesData.length > 0) {
            newDailyRatesData.forEach((data) => {
               const rsvnId = data.dailyRateId.substr(0, 8);
               validation.idCheck(rsvnId);
               validation.numberCheck(data.price, '가격');
               if (id < Number(rsvnId + '001') || id > Number(rsvnId + '999'))
                  throw createError(422, '일별요금 고유번호 입력오류');
            });
         } else {
            throw createError(422, '변경할 일별요금 내용 미입력');
         }
      } else {
         throw createError(422, '변경할 일별요금 입력 형식 오류(Not an array)');
      }
      next();
   } catch (err) {
      next(err);
   }
};
