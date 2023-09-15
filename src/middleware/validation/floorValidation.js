import * as validation from '../../source/js/function/validation/commonValidationFn.js';

export const createFloorsValidation = (req, res, next) => {
   try {
      const { floors } = req.body;

      floors.forEach((floor) => {
         validation.numberCheck(floor, '층');
      });

      next();
   } catch (err) {
      next(err);
   }
};
