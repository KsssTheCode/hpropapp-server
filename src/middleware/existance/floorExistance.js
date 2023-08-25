import * as existance from '../../source/js/function/existance/existanceFn.js';
import { createError } from '../../source/js/function/commonFn.js';

export const craeteFloorsExistance = async (req, res, next) => {
   try {
      const { floors } = req.body;
      const floorsArr = floors.split(',');
      for await (let floor of floorsArr) {
         const isDuplicatedFloor = await existance.checkExistingFloor(floor);
         if (isDuplicatedFloor) throw createError(409, '이미 존재하는 층');
      }
      next();
   } catch (err) {
      next(err);
   }
};
