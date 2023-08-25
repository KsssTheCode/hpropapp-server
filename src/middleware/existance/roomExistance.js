import { createError } from '../../source/js/function/commonFn.js';
import * as existance from '../../source/js/function/existance/existanceFn.js';

export const createRoomsExistance = async (req, res, next) => {
   try {
      const { roomTypeCode, roomNumbers } = req.body;
      const isExistingRoomType = await existance.checkExistingRoomType(
         roomTypeCode
      );
      if (!isExistingRoomType)
         throw createError(400, '존재하지 않는 객실타입코드');

      //checkExistingRoomNumbers의 리던값으로 [isExistingRooms, notExistingRooms]를 받아
      //rooms에 담아 전달함
      req.body.rooms = await existance.checkExistingRoomNumbers(roomNumbers);
      if (req.body.rooms.isExistingRooms.length === roomNumbers.length)
         throw createError(400, '요청한 객실 모두 이미 존재하는 객실');
      next();
   } catch (err) {
      next(err);
   }
};

export const assignRoomExistance = async (req, res, next) => {
   try {
      const { roomNumber, rsvnId } = req.body;

      const isExistingRsvn = await existance.checkExistingRsvn(rsvnId);
      if (!isExistingRsvn) throw createError(400, '존재하지 않는 예약');
      // if(isExistingRsvn.roomNumber)

      const alreadyAssignedRoom = await existance.checkAssignedRoom(
         roomNumber,
         isExistingRsvn.arrivalDate,
         isExistingRsvn.departureDate
      );
      if (alreadyAssignedRoom.length > 0)
         throw createError(400, '이미 배정된 객실');
      const isExistingRoomNumber = await existance.checkExistingRoomNumber(
         roomNumber
      );

      if (!isExistingRoomNumber) throw createError(400, '존재하지 않는 객실');
      next();
   } catch (err) {
      next(err);
   }
};

export const editRoosmsExistance = async (req, res, next) => {
   try {
      const { roomTypeCode, roomNumbers } = req.body;
      const isExistingRoomType = await existance.checkExistingRoomType(
         roomTypeCode
      );
      if (!isExistingRoomType)
         throw createError(400, '존재하지 않는 객실타입코드');

      //checkExistingRoomNumbers의 리던값으로 [isExistingRooms, notExistingRooms]를 받아
      //rooms에 담아 전달함
      req.body.rooms = await existance.checkExistingRoomNumbers(roomNumbers);
      if (req.body.rooms.notExistingRoomNumbers.length === roomNumbers.length)
         throw createError(400, '요청한 객실 모두 존재하지 않는 객실');
      next();
   } catch (err) {
      next(err);
   }
};

export const deleteRoomExistance = async (req, res, next) => {
   try {
      const { roomNumbers, rooms } = req.body;
      rooms = await existance.checkExistingRoomNumbers(roomNumbers);
      if (req.body.rooms.notExistingRoomNumbers.length === roomNumbers.length)
         throw createError(400, '요청한 객실 모두 존재하지 않는 객실');
      next();
   } catch (err) {
      next(err);
   }
};

export const getRoomsInOptionsForPreviewExistance = async (req, res, next) => {
   try {
      const { floors, cleanStatusCodes, groupIds, roomTypeCodes } = req.query;
      if (floors) {
         const floorsArr = floors.split(',');
         for await (let number of floorsArr) {
            const isExistingFloor = existance.checkExistingFloor(number);
            if (!isExistingFloor)
               throw createError(400, '존재하지 않는 층수(${number})');
         }
      }

      if (cleanStatusCodes) {
         const cleanStatusCodesArr = cleanStatusCodes.split(',');
         for await (let code of cleanStatusCodesArr) {
            const isExistingCleanStatus =
               await existance.checkExsitingCleanStatusCode(code);
            if (!isExistingCleanStatus)
               throw createError(400, `존재하지 않는 정비코드(${code})`);
         }
      }

      if (groupIds) {
         const groupIdsArr = groupIds.split(',');
         for await (let id of groupIds) {
            const isExistingGroup = await existance.checkExistingGroup(id);
            if (!isExistingGroup)
               throw createError(400, `존재하지 않는 단체 ID(${id})`);
         }
      }

      if (roomTypeCodes) {
         const roomTypeCodesArr = roomTypeCodes.split(',');
         for await (let code of roomTypeCodes) {
            const isExistingRoomType = await existance.checkExistingRoomType(
               code
            );
            if (!isExistingRoomType)
               throw createError(400, `존재하지 않는 객실타입코드(${code})`);
         }
      }
      next();
   } catch (err) {
      next(err);
   }
};
