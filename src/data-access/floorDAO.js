import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';

const Floor = db.Floor;

export const getFloorsDataDAO = async () => {
   try {
      return await Floor.findAll({
         attributes: ['floorNumber'],
      }).catch(() => {
         throw createError(500, '층 조회 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const createFloorsDataDAO = async (createData) => {
   try {
      return await Floor.bulkCreate(createData).catch(() => {
         throw createError(500, '층 생성 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};
