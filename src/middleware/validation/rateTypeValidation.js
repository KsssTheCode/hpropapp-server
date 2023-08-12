import * as validation from '../../source/js/function/validation/commonValidationFn.js';

export const createRateTypeValidation = (req, res, next) => {
   try {
      const { rateTypeCode, reference } = req.body;
      validation.rateTypeCodeCheck(rateTypeCode);
      if (reference) validation.referenceCheck(reference);
      next();
   } catch (err) {
      next(err);
   }
};

export const editRateTypeValidation = (req, res, next) => {
   try {
      const { rateTypeCode, newRateTypeCode, reference } = req.body;
      validation.rateTypeCodeCheck(rateTypeCode);
      if (newRateTypeCode) validation.rateTypeCodeCheck(newRateTypeCode);
      if (reference) validation.referenceCheck(reference);
      next();
   } catch (err) {
      next(err);
   }
};

export const checkRateTypeValidationOnly = (req, res, next) => {
   try {
      const { rateTypeCode } = req.body;
      validation.rateTypeCodeCheck(rateTypeCode);
      next();
   } catch (err) {
      next(err);
   }
};
