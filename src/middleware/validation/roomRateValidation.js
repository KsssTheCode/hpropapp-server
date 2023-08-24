import { createError } from '../../source/js/function/commonFn.js';
import * as validation from '../../source/js/function/validation/commonValidationFn.js';

export const initializeRoomRatesValidation = (req, res, next) => {
   try {
      const { rateTypeCode, roomTypeCode, startDate, endDate } = req.body;

      rateTypeCode.split(',').forEach((code) => {
         validation.rateTypeCodeCheck(code);
      });

      roomTypeCode.split(',').forEach((code) => {
         validation.roomTypeCodeCheck(code);
      });

      const { adjustedStartDate, adjustedEndDate } =
         validation.dateSearchOptionsCheck(startDate, endDate);
      req.query.startDate = adjustedStartDate;
      req.query.endDate = adjustedEndDate;

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

export const validateAllOptionsOfRoomRates = (req, res, next) => {
   try {
      const { rateTypeCode, roomTypeCode, startDate, endDate } = req.query;

      validation.rateTypeCodeCheck(rateTypeCode);
      validation.roomTypeCodeCheck(roomTypeCode);
      validation.dateSearchOptionsCheck(startDate, endDate);
      next();
   } catch (err) {
      next(err);
   }
};

export const editRoomRatesInOptionsValidation = (req, res, next) => {
   try {
      const { startDate, endDate, rateTypeCodes, roomTypeCodes, newPrice } =
         req.body;

      if (rateTypeCodes) {
         rateTypeCodes.split(',').forEach((code) => {
            validation.rateTypeCodeCheck(code);
         });
      }
      if (roomTypeCodes) {
         roomTypeCodes.split(',').forEach((code) => {
            validation.roomTypeCodeCheck(code);
         });
      }

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
