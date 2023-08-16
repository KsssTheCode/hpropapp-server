import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';

const RateType = db.RateType;

export const getRateTypesDataForFilterSelectionDAO = async () => {
   try {
      return await RateType.findAll({
         attributes: ['rateTypeCode'],
      }).catch((err) => {
         console.log(err);
         throw createError(500, '요금책정형식 조회 중 DB에서 오류발생');
      });
      return response;
   } catch (err) {
      throw err;
   }
};
