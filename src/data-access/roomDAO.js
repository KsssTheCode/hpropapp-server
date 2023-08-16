import db from '../models/index.js';
import { Op } from 'sequelize';
import {
   createError,
   currentDateFormat,
} from '../source/js/function/commonFn.js';

const Room = db.Room;

export const createRoomsDAO = async (createRoomsData) => {
   try {
      return await Room.bulkCreate(createRoomsData).catch(() => {
         throw createError(500, '객실정보변경 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const assignRoomDAO = async (roomNumber, rsvnId) => {
   try {
      return await db.Reservation.update(
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
   } catch (err) {
      throw err;
   }
};

export const getAllRoomsDataForPreview = async () => {
   try {
      return await db.Room.findAll({
         attributes: ['floorNumber', 'roomNumber', 'roomTypeCode'],
      }).catch(() => {
         throw createError(500, '객실조회 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const getAssignedRsvnsDataForPreview = async (today) => {
   try {
      return await db.Reservation.findAll({
         attributes: [
            'rsvnId',
            'roomNumber',
            'guestName',
            'arrivalDate',
            'departureDate',
         ],
         where: {
            roomNumber: { [Op.not]: null },
            arrivalDate: { [Op.lte]: today },
            departureDate: { [Op.gte]: today },
         },
      }).catch(() => {
         throw createError(500, '예약건 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const getRoomsInReserveStatusDAO = async () => {
   try {
      return await Room.findAll({
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
   } catch (err) {
      throw err;
   }
};

export const getAssignedRoomNumbersInTermDAO = async (startDate, endDate) => {
   try {
      return await db.Reservation.findAll({
         attributes: ['roomNumber'],
         where: {
            [Op.and]: [
               { arrivalDate: { [Op.lt]: endDate } },
               { departureDate: { [Op.gte]: startDate } },
            ],
         },
         raw: true,
      });
   } catch (err) {
      throw err;
   }
};

export const getRoomsDataInOptionsForAssignDAO = async (
   reservedRooms,
   roomTypeCodes,
   cleanStatusCodes,
   floors
) => {
   try {
      return await Room.findAll({
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
   } catch (err) {
      throw err;
   }
};

export const editRoomTypeOfRoomsDAO = async (roomTypeCode, isExistingRooms) => {
   try {
      return await Room.update(
         { roomTypeCode },
         {
            where: {
               roomNumber: { [Op.in]: isExistingRooms },
            },
         }
      ).catch((err) => {
         throw createError(500, '객실정보변경 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const deleteRoomsDAO = async (isExistingRooms) => {
   try {
      return await Room.destroy({
         where: {
            roomNumber: { [Op.in]: isExistingRooms },
         },
      }).catch(() => {
         throw createError(500, '객실호수 삭제 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const getAllRoomsForPreviewDAO = async () => {
   try {
      return await Room.findAll({
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
               model: db.CleanStatus,
               attributes: ['cleanStatusCode'],
               where: {
                  createdAt: sequelize.fn(
                     'MAX',
                     sequelize.col('CleanStatus.createdAt')
                  ),
               },
            },
         ],
      }).catch(() => {
         throw createError(500, '객실정보 조회 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const getRoomsInOptionsForPreviewDAO = async (
   floors,
   cleanStatusCodes,
   groupIds,
   roomTypeCodes
) => {
   try {
      return await Room.findAll(
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
            },
         }
      ).catch(() => {
         throw createError(500, '객실정보 조회 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};
