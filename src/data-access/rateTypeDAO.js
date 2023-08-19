import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';

const RateType = db.RateType;

export const createRateTypeDAO = async (createData) => {
   try {
      return await RateType.create(createData).catch(() => {
         throw createError(500, '요금책정형식 생성 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

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

export const editRateTypeDAO = async (rateTypeCode, updateData) => {
   try {
      return await RoomType.update(updateData, {
         where: {
            rateTypeCode: rateTypeCode,
         },
      }).catch(() => {
         throw createError(500, '요금책정 정보 변경 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const deleteRateTypeDAO = async (rateTypeCode) => {
   try {
      return await RateType.destroy({
         where: { rateTypeCode: rateTypeCode },
      }).catch(() => {
         throw createError(500, '요금책정형식 삭제 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};
