import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';

const Floor = db.Floor;

export const getFloors = async (req, res, next) => {
   try {
      const floorsData = await Floor.findAll({
         attributes: ['floorNumber'],
      }).catch(() => {
         throw createError(500, '층 조회 중 DB에서 오류발생');
      });

      res.status(200).json(floorsData);
   } catch (err) {
      next(err);
   }
};
export const createFloors = async (req, res, next) => {
   try {
      const { floors } = req.body;

      const sendingFloorsData = floors.map((floor) => {
         return { floorNumber: floor };
      });

      await Floor.bulkCreate(sendingFloorsData).catch(() => {
         throw createError(500, '층 생성 중 DB에서 오류발생');
      });

      res.status(200).send(`${floors.join(', ')}층 생성완료`);
   } catch (err) {
      next(err);
   }
};
