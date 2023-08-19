import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';

const CleanStatus = db.CleanStatus;

export const createCleanStatusDAO = async (cleanStatusCode, statusName) => {
   try {
      return await CleanStatus.create({
         cleanStatusCode,
         statusName,
      }).catch((err) => {
         console.log(err);
         throw createError(500, '정비상태 생성 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const deleteCleansStatusDAO = async (cleanStatusCode) => {
   try {
      return await CleanStatus.destroy({
         where: { cleanStatusCode },
      }).catch(() => {
         throw createError(500, '정비상태 생성 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const getCleanStatusesDAO = async () => {
   try {
      return await CleanStatus.findAll().catch(() => {
         throw createError(500, '정비상태 조회 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};
