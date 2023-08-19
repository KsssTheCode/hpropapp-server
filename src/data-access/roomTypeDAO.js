import { Op } from 'sequelize';
import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';

const RoomType = db.RoomType;

export const createRoomTypeDAO = async (createData) => {
   try {
      return await RoomType.create(createData).catch(() => {
         throw createError(500, '객실타입 생성 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const getRoomTypesDataForFilterSelectionDAO = async () => {
   try {
      return await RoomType.findAll({
         attributes: ['roomTypeCode', 'roomTypeName'],
         where: { deletedAt: null },
      }).catch(() => {
         throw createError(500, '객실타입 조회 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const getSelectedRoomTypeDAO = async (roomTypeCode) => {
   try {
      return await RoomType.findByPk(roomTypeCode).catch(() => {
         throw createError(500, '객실타입 조회 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const editRoomTypeDAO = async (roomTypeCode, updateData) => {
   try {
      return await RoomType.update(updateData, {
         where: {
            roomTypeCode: roomTypeCode,
         },
      }).catch(() => {
         throw createError(500, '객실타입정보 변경 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const deleteRoomTypeDAO = async (roomTypeCode) => {
   try {
      return await RoomType.destroy({
         where: {
            roomTypeCode: roomTypeCode,
         },
      }).catch(() => {
         throw createError(500, '객실변경 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};
