import { Op } from 'sequelize';
import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';

const RoomType = db.RoomType;

export const createRoomType = async (req, res, next) => {
   try {
      const { roomTypeCode, roomTypeName, roomMaxPeople, rackRate } = req.body;

      await RoomType.create({
         roomTypeCode,
         roomTypeName,
         roomMaxPeople,
         rackRate,
      }).catch(() => {
         throw createError(500, '객실타입 생성 중 DB에서 오류발생');
      });

      res.status(200).send('새로운 객실타입 생성 완료');
   } catch (err) {
      next(err);
   }
};

export const getAllRoomTypes = async (req, res, next) => {
   try {
      const { attributes } = req.query;
      const attributesArr = attributes.split(',');
      const roomTypeDatas = await RoomType.findAll({
         attributes: attributesArr,
         where: { deletedAt: null },
      }).catch((err) => {
         console.log(err);
         throw createError(500, '객실타입 조회 중 DB에서 오류발생');
      });
      res.status(200).json(roomTypeDatas);
   } catch (err) {
      next(err);
   }
};

export const getSelectedRoomType = async (req, res, next) => {
   try {
      const { roomTypeCode } = req.body;
      const roomTypeData = await RoomType.findByPk(roomTypeCode).catch(() => {
         throw createError(500, '객실타입 조회 중 DB에서 오류발생');
      });

      res.status(200).json(roomTypeData);
   } catch (err) {
      next(err);
   }
};

export const editRoomType = async (req, res, next) => {
   try {
      const {
         roomTypeCode,
         newRoomTypeCode,
         newRoomTypeName,
         newRoomMaxPeople,
         newRackRate,
      } = req.body;

      await RoomType.update(
         {
            roomTypeCode: newRoomTypeCode,
            roomTypeName: newRoomTypeName,
            roomMaxPeople: newRoomMaxPeople,
            rackRate: newRackRate,
         },
         {
            where: {
               roomTypeCode: roomTypeCode,
            },
         }
      ).catch(() => {
         throw createError(500, '객실타입정보 변경 중 DB에서 오류발생');
      });

      res.status(200).send('객실변경완료');
   } catch (err) {
      next(err);
   }
};

export const deleteRoomType = async (req, res, next) => {
   try {
      const { roomTypeCode } = req.body;

      await RoomType.destroy({
         where: {
            roomTypeCode: roomTypeCode,
         },
      }).catch(() => {
         throw createError(500, '객실변경 중 DB에서 오류발생');
      });

      res.status(200).send(
         '객실타입 삭제(비활성화)완료 \n 삭제된 객실타입의 객실호수를 변경해주세요'
      );
   } catch (err) {
      next(err);
   }
};
