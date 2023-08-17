import db from './index.js';
import { createError } from '../source/js/function/commonFn.js';
import moment from 'moment';

export const afterUpdateHook = async (group, options) => {
   try {
      await db.sequelize.models.CustomerChangeHistory.create(
         {
            updatedProperties: group.previous(),
            updatedReservation: group,
            staffId: options.staffId,
            updatedTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            rsvnId: group.groupId,
         },
         {
            transaction: options.transaction,
         }
      ).catch((err) => {
         console.log(err);
         throw createError(500, '변경기록 생성 중 DB에서 오류발생');
      });
   } catch (err) {
      console.log(err);
      throw err;
   }
};
