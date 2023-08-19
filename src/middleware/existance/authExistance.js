import { createError } from '../../source/js/function/commonFn.js';
import * as existance from '../../source/js/function/existance/existanceFn.js';

export const loginExistance = async (req, res, next) => {
   try {
      const { staffId } = req.body;
      const isExistingStaff = await existance.checkExistingStaff(staffId);
      if (!isExistingStaff) createError(422, '유효하지 않은 사번');
   } catch (err) {
      next(err);
   }
};
