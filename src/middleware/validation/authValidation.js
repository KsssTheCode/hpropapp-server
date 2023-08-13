import * as validation from '../../source/js/function/validation/commonValidationFn.js';
import * as staffValidation from '../../source/js/function/validation/staffValidationFn.js';

export const loginValidation = (req, res, next) => {
   try {
      const { staffId, password } = req.body;
      staffValidation.staffIdCheck(staffId);
      validation.passwordCheck(password);
      next();
   } catch (err) {
      next(err);
   }
};
