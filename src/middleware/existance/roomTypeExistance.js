import { createError } from '../../source/js/function/commonFn.js';
import {
   checkExistingRoomType,
   checkNumberOfGuestsInRange,
} from '../../source/js/function/existance/existanceFn.js';

export const createRoomTypeExistance = async (req, res, next) => {
   try {
      const { roomTypeCode } = req.body;
      const isExistingRoomType = await checkExistingRoomType(roomTypeCode);
      if (isExistingRoomType) throw createError(400, '이미 존재하는 객실타입');
      next();
   } catch (err) {
      next(err);
   }
};

export const editRoomTypeExistance = async (req, res, next) => {
   try {
      const { roomTypeCode, newRoomTypeCode } = req.body;
      const isExistingRoomType = await checkExistingRoomType(roomTypeCode);
      if (!isExistingRoomType) throw createError(400, '존재하지 않는 객실타입');

      const isDuplicateRoomType = await checkExistingRoomType(newRoomTypeCode);
      if (isDuplicateRoomType)
         throw createError(
            400,
            `이미 존재하는 객실타입코드(${newRoomTypeCode})`
         );
      next();
   } catch (err) {
      next(err);
   }
};

export const checkRoomTypeExistanceOnly = async (req, res, next) => {
   try {
      const { roomTypeCode } = req.body;
      const isExistingRoomType = await checkExistingRoomType(roomTypeCode);
      if (!isExistingRoomType) throw createError(400, '존재하지 않는 객실타입');
      next();
   } catch (err) {
      next(err);
   }
};
