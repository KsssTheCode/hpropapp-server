import { createError } from '../../source/js/function/commonFn.js';
import * as validation from '../../source/js/function/validation/commonValidationFn.js';
// import * as membershipValidation from '../../source/js/function/validation/membershipValidationFn.js';

export const createMembershipValidation = (req, res, next) => {
   try {
      const { membershipGrade, discount } = req.body;

      validation.membershipGradeCheck(membershipGrade);
      if (discount) validation.discountCheck(discount);

      next();
   } catch (err) {
      next(err);
   }
};

export const editMembershipValidation = (req, res, next) => {
   try {
      const { membershipGrade, newMembershipGrade, newDiscount } = req.body;

      validation.membershipGradeCheck(membershipGrade);
      validation.membershipGradeCheck(newMembershipGrade);
      if (newDiscount) validation.discountCheck(newDiscount);
      next();
   } catch (err) {
      next(err);
   }
};

export const deleteMembership = (req, res, next) => {
   try {
      const { membershipGrade } = req.body;
      validation.membershipGradeCheck(membershipGrade);
      next();
   } catch (err) {
      next(err);
   }
};
