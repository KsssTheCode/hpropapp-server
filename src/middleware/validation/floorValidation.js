import * as validation from '../../source/js/function/validation/commonValidationFn.js';

export const createFloorsValidation = (req, res, next) => {
   try {
      const { floors } = req.body;

      floors.length > 0
         ? floors.forEach((floor) => {
              validation.numberCheck(floor, '층');
           })
         : () => {
              throw createError(400, '층 수 입력오류(배열이 아님)');
           };

      next();
   } catch (err) {
      next(err);
   }
};
