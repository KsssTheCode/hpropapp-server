import { createError } from '../../source/js/function/commonFn.js';
import * as validation from '../../source/js/function/validation/commonValidationFn.js';

export const getAndInitializeRoomRatesValidation = (req, res, next) => {
   try {
      const { rateTypeCode, roomTypeCode, startDate, endDate } = req.body;
      Array.isArray(rateTypeCode)
         ? roomTypeCode.forEach((code) => {
              validation.rateTypeCodeCheck(code);
           })
         : () => {
              throw createError(400, '요금책정타입 입력오류(배열이 아님)');
           };

      Array.isArray(roomTypeCode)
         ? roomTypeCode.forEach((code) => {
              validation.roomTypeCodeCheck(code);
           })
         : () => {
              throw createError(400, '객실타입 입력오류(배열이 아님)');
           };

      if (startDate) validation.dateCheck(startDate);
      if (endDate) validation.dateCheck(endDate);
      if (+startDate > +endDate)
         throw createError(400, '시작일이 종료일보다 늦을 수 없음');

      next();
   } catch (err) {
      next(err);
   }
};

export const editSpecificRoomRatesValidation = (req, res, next) => {
   try {
      const { editObjects } = req.body;
      for (const item in editObjects) {
         const { rateTypeCode, roomTypeCode, date, newPrice } =
            editObjects[item];
         if (rateTypeCode) validation.rateTypeCodeCheck(code);
         if (roomTypeCode) validation.roomTypeCodeCheck(code);
         if (date) validation.dateCheck(date);
         if (newPrice) validation.numberCheck(newPrice);
      }
      next();
   } catch (err) {
      next(err);
   }
};

export const editRoomRatesInOptionsValidation = (req, res, next) => {
   try {
      const { startDate, endDate, rateTypeCodes, roomTypeCodes, newPrice } =
         req.body;
      Array.isArray(rateTypeCodes)
         ? roomTypeCodes.forEach((code) => {
              validation.rateTypeCodeCheck(code);
           })
         : () => {
              throw createError(400, '요금책정형식 입력오류(배열이 아님)');
           };

      Array.isArray(roomTypeCodes)
         ? roomTypeCodes.forEach((code) => {
              validation.roomTypeCodeCheck(code);
           })
         : () => {
              throw createError(400, '객실타입 입력오류(배열이 아님)');
           };

      newPrice
         ? numberCheck(newPrice)
         : () => {
              throw createError(400, '변경금액 미입력');
           };

      if (startDate) dateCheck(startDate);
      if (endDate) dateCheck(endDate);
      if (+startDate > +endDate)
         throw createError(400, '검색 시작일이 검색 종료일보다 늦을 수 없음');

      next();
   } catch (err) {
      next(err);
   }
};
