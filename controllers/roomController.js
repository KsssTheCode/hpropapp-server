import db from '../models/index.js';
import { Op } from 'sequelize';
import {
   createError,
   currentDateFormat,
} from '../source/js/function/commonFn.js';

const Room = db.Room;

export const createRooms = async (req, res, next) => {
   try {
      const { roomNumbers, roomTypeCode } = req.body;
      const { isExistingRooms, notExistingRooms } = req.body.rooms;

      const createRoomsData = notExistingRooms.map((roomNumber) => {
         return {
            roomNumber: roomNumber,
            roomTypeCode: roomTypeCode,
            floorNumber: roomNumber.toString().slice(0, -2),
            cleanStatusCodes: 'C',
         };
      });

      await Room.bulkCreate(createRoomsData).catch(() => {
         throw createError(500, '객실정보변경 중 DB에서 오류발생');
      });

      notExistingRooms.length === roomNumbers.length
         ? res.status(200).send('모든객실 생성완료')
         : res
              .status(200)
              .send(
                 `일부객실 생성 성공 \n 성공 : '${notExistingRooms.join()}' \n 실패 : '${isExistingRooms.join()}'(이미 존재하는 객실)`
              );
   } catch (err) {
      next(err);
   }
};

export const assignRoom = async (req, res, next) => {
   try {
      const { roomNumber, rsvnId } = req.body;

      await db.Reservation.update(
         { roomNumber: roomNumber },
         {
            where: {
               rsvnId: rsvnId,
               roomNumber: { [Op.eq]: null },
            },
         }
      ).catch(() => {
         throw createError(500, '객실배정 중 DB에서 오류발생');
      });

      res.status(200).send('객실 배정 성공');
   } catch (err) {
      next(err);
   }
};

export const getRoomsForRoomPreview = async (req, res, next) => {
   try {
      const roomsData = await db.Room.findAll({
         attributes: ['floorNumber', 'roomNumber', 'roomTypeCode'],
      }).catch(() => {
         throw createError(500, '객실조회 중 DB에서 오류발생');
      });

      const assignedRsvnsData = await db.Reservation.findAll({
         attributes: [
            'rsvnId',
            'roomNumber',
            'guestName',
            'arrivalDate',
            'departureDate',
         ],
         where: {
            roomNumber: { [Op.not]: null },
            arrivalDate: { [Op.lte]: currentDateFormat(8) },
            departureDate: { [Op.gte]: currentDateFormat(8) },
         },
      }).catch(() => {
         throw createError(500, '예약건 중 DB에서 오류발생');
      });

      const roomPreviewData = roomsData.map((room, i) => {
         const rsvn = assignedRsvnsData.find((rsvn) => {
            return rsvn.roomNumber === room.roomNumber;
         });
         if (rsvn)
            return { ...room.dataValues, rsvnData: { ...rsvn.dataValues } };
         return { ...room.dataValues };
      });

      res.status(200).json(roomPreviewData);
   } catch (err) {
      next(err);
   }
};

export const getAllRooms = async (req, res, next) => {
   try {
      const roomsData = await Room.findAll({
         include: {
            model: db.Reservation,
            where: {
               status: 'RR',
            },
         },
         raw: true,
      }).catch(() => {
         throw createError(500, '객실조회 중 DB에서 오류발생');
      });

      res.status(200).json(roomsData);
   } catch (err) {
      next(err);
   }
};

export const getRoomsInOptionsForAssign = async (req, res, next) => {
   const { roomTypeCodes, startDate, endDate, floors, cleanStatusCodes } =
      req.query;
   console.log(req.query);
   try {
      const reservedRoomNumbers = await db.Reservation.findAll({
         attributes: ['roomNumber'],
         where: {
            arrivalDate: { [Op.lt]: endDate },
            departureDate: { [Op.gte]: startDate },
         },
         raw: true,
      });

      // 예약된 객실 번호 배열 추출
      const reservedRooms = [];
      reservedRoomNumbers.forEach((rsvn) => {
         if (rsvn.roomNumber) reservedRooms.push(rsvn.roomNumber);
      });

      const roomsData = await Room.findAll({
         where: {
            roomNumber: {
               [Op.notIn]: reservedRooms,
            },
            ...(roomTypeCodes &&
               (roomTypeCodes.includes(',')
                  ? { roomTypeCode: { [Op.in]: roomTypeCodes } }
                  : { roomTypeCode: { [Op.eq]: roomTypeCodes } })),
            ...(floors &&
               (floors.includes(',')
                  ? { floor: { [Op.in]: floors } }
                  : { floor: { [Op.eq]: floors } })),
            ...(cleanStatusCodes &&
               (cleanStatusCodes.includes(',')
                  ? { cleanStatusCodes: { [Op.in]: cleanStatusCodes } }
                  : { cleanStatusCodes: { [Op.eq]: cleanStatusCodes } })),
         },
      }).catch((err) => {
         console.log(err);
         throw createError(500, '배정 가능 객실 조회 중 DB에서 오류발생');
      });

      res.status(200).json(roomsData);
   } catch (err) {
      next(err);
   }
};

export const editRoomTypeOfRooms = async (req, res, next) => {
   try {
      const { roomNumbers, roomTypeCode } = req.body;
      const { isExistingRooms, notExistingRooms } = req.body.rooms;

      await Room.update(
         { roomTypeCode: roomTypeCode },
         {
            where: {
               roomNumber: { [Op.in]: isExistingRooms },
            },
         }
      ).catch((err) => {
         throw createError(500, '객실정보변경 중 DB에서 오류발생');
      });

      isExistingRooms.length === roomNumbers.length
         ? res.status(200).send('모든객실 변경완료')
         : res
              .status(200)
              .send(
                 `일부객실 변경 성공 \n 성공 : ${isExistingRooms.join()} \n 실패 : ${notExistingRooms.join()}(존재하지 않은 객실)`
              );
   } catch (err) {
      next(err);
   }
};

export const deleteRooms = async (req, res, next) => {
   try {
      const { isExistingRooms, notExistingRooms } = req.body.rooms;

      await Room.destroy({
         where: {
            roomNumber: { [Op.in]: isExistingRooms },
         },
      }).catch(() => {
         throw createError(500, '객실호수 삭제 중 DB에서 오류발생');
      });

      isExistingRooms.length === roomNumbers.length
         ? res.status(200).send('모든객실 비활성화 완료')
         : res
              .status(200)
              .send(
                 `일부객실 삭제(비활성화) 성공 \n 성공 : ${isExistingRooms.join()} \n 실패 : ${notExistingRooms.join()}(존재하지 않은 객실)`
              );
   } catch (err) {
      next(err);
   }
};

export const getAllRoomsForPreview = async (req, res, next) => {
   try {
      const roomDatas = await Room.findAll({
         attributes: ['roomNumber', 'roomStatus'],
         include: [
            {
               model: db.Reservation,
               attributes: [
                  'rsvnId',
                  'guestName',
                  'arrivalDate',
                  'departureDate',
               ],
            },
            {
               model: db.RoomCleanStatus,
               attributes: ['roomCleanStatus'],
               where: {
                  createdAt: sequelize.fn(
                     'MAX',
                     sequelize.col('RoomCleanStatus.createdAt')
                  ),
               },
            },
         ],
      }).catch(() => {
         throw createError(500, '객실정보 조회 중 DB에서 오류발생');
      });

      res.status(200).json(roomDatas);
   } catch (err) {
      next(err);
   }
};

export const getRoomsInOptionsForPreview = async (req, res, next) => {
   try {
      const { floors, cleanStatusCodes, assignYN, groupIds, roomTypeCodes } =
         req.body;
      const roomDatas = await Room.findAll(
         {
            attributes: ['roomNumber', 'roomStatus'],
            include: {
               model: db.Reservation,
               attributes: [
                  'rsvnId',
                  'guestName',
                  'arrivalDate',
                  'departureDate',
               ],
               where: {
                  groupId: { [Op.in]: groupIds },
                  roomTypeCode: { [Op.in]: roomTypeCodes },
               },
            },
            include: {
               model: db.CleanStatus,
               attributes: ['cleanStatusCode'],
               where: {
                  [Op.and]: [
                     { cleanStatusCode: { [Op.in]: cleanStatusCodes } },
                     {
                        createdAt: sequelize.fn(
                           'MAX',
                           sequelize.col('CleanStatus.createdAt')
                        ),
                     },
                  ],
               },
            },
         },
         {
            where: {
               floor: { [Op.in]: floors },
               assignYN: assignYN,
            },
         }
      ).catch(() => {
         throw createError(500, '객실정보 조회 중 DB에서 오류발생');
      });

      res.status(200).json(roomDatas);
   } catch (err) {
      next(err);
   }
};
