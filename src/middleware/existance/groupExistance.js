import * as existance from '../../source/js/function/existance/existanceFn.js';
import {
   createError,
   countRecords,
} from '../../source/js/function/commonFn.js';

export const checkGroupExistanceOnly = async (req, res, next) => {
   try {
      const { groupId } = req.body;
      const isExistingGroup = await existance.checkExistingGroup(groupId);
      if (!isExistingGroup) throw createError(404, '존재하지 않는 단체');
      next();
   } catch (err) {
      next(err);
   }
};
