import { createError } from '../../source/js/function/commonFn.js';
import * as validation from '../../source/js/function/validation/commonValidationFn.js';
// import * as membershipValidation from '../../source/js/function/validation/membershipValidationFn.js';

export const createMembershipValidation = (req, res, next) => {
   try {
      const { membershipGrade, discount } = req.body;

      if (membershipGrade <= 'A' || membershipGrade >= 'Z')
         throw createError(400, '멤버십등급 입력오류');

      if (discount) validation.discountCheck(discount);

      next();
   } catch (err) {
      next(err);
   }
};

export const editMembershipValidation = (req, res, next) => {
   try {
      const { membershipGrade, newDiscount } = req.body;

      if (membershipGrade <= 'A' || membershipGrade >= 'Z')
         throw createError(400, '멤버십등급 입력오류');

      if (newDiscount) validation.discountCheck(newDiscount);
      next();
   } catch (err) {
      next(err);
   }
};

export const deleteMembership = (req, res, next) => {
   try {
      const { membershipGrade } = req.body;
      if (membershipGrade <= 'A' || membershipGrade >= 'Z')
         throw createError(400, '멤버십등급 입력오류');
      next();
   } catch (err) {
      next(err);
   }
};
