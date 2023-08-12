import * as existance from '../../source/js/function/existance/existanceFn.js';

export const createRateTypeExistance = async (req, res, next) => {
   try {
      const { rateTypeCode } = req.body;
      const isDuplicatRateType = await existance.checkExistingRateType(
         rateTypeCode
      );
      if (isDuplicatRateType)
         throw createError(400, '이미 존재하는 요금책정타입');
      next();
   } catch (err) {
      next(err);
   }
};

export const editRateTypeExistance = async (req, res, next) => {
   try {
      const { rateTypeCode, newRateTypeCode } = req.body;
      const isExistingRateType = await existance.checkExistingRateType(
         rateTypeCode
      );
      if (!isExistingRateType)
         throw createError(400, '존재하지 않는 요금책정타입');
      const isDuplicateRateType = await existance.checkExistingRateType(
         newRateTypeCode
      );
      if (isDuplicateRateType)
         throw createError(400, '이미 존재하는 요금책정타입(변경할 타입)');
      next();
   } catch (err) {
      next(err);
   }
};

export const checkRateTypeExistanceOnly = async (req, res, next) => {
   try {
      const { rateTypeCode } = req.body;
      const isExistingRateType = await existance.checkExistingRateType(
         rateTypeCode
      );
      if (!isExistingRateType)
         throw createError(400, '존재하지 않는 요금책정타입');
      next();
   } catch (err) {
      next(err);
   }
};
