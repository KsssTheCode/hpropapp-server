import { createError } from '../../source/js/function/commonFn.js';
import * as existance from '../../source/js/function/existance/existanceFn.js';

export const createCleanStatus = (req, res, next) => {
   try {
      const { cleanStatusCode } = req.body;
      const isDuplicateCode =
         existance.checkExistingCleanStatusCode(cleanStatusCode);
      if (isDuplicateCode) throw createError(409, '이미 존재하는 객실정비코드');
      next();
   } catch (err) {
      next(err);
   }
};

export const deleteCleanStatus = (req, res, next) => {
   try {
      const { cleanStatusCode } = req.body;
      const isExistingCode =
         existance.checkExistingCleanStatusCode(cleanStatusCode);
      if (!isExistingCode) throw createError(404, '존재하지 않는 객실정비코드');
      next();
   } catch (err) {
      next(err);
   }
};
