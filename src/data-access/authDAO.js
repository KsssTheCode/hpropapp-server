import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';

export const logInDAO = async (staffId) => {
   try {
      return await db.Staff.findByPk(staffId, {
         where: { leaveDate: null },
      }).catch(() => {
         throw createError(500, '직원조회 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};
