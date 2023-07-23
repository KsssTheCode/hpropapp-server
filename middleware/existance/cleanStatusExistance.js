import { createError } from '../../source/js/function/commonFn.js';
import * as existance from '../../source/js/function/existance/existanceFn.js';

export const createCleanStatus = async (req, res, next) => {
   try {
      const { cleanStatusCode } = req.body;
      const isDuplicateCode = await existance.checkExistingCleanStatusCode(
         cleanStatusCode
      );
      if (isDuplicateCode) throw createError(400, '이미 존재하는 객실정비코드');
      next();
   } catch (err) {
      next(err);
   }
};

export const deleteCleanStatus = async (req, res, next) => {
   try {
      const { cleanStatusCode } = req.body;
      const isExistingCode = await existance.checkExistingCleanStatusCode(
         cleanStatusCode
      );
      if (!isExistingCode) throw createError(400, '존재하지 않는 객실정비코드');
      next();
   } catch (err) {
      next(err);
   }
};
