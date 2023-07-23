import fsPromise from 'fs/promises';
import * as validation from '../middleware/validation.js';
// const fsPromise = require('fs/promises');
// const validation = require('../middleware/validation.js');

export const createRoomType = async (req, res, next) => {
   const { roomTypeCode, roomTypeName, roomMaxPeople, rackRate } = req.body;

   try {
      validation.roomTypeCodeCheck(roomTypeCode);
      validation.minusCheck(roomMaxPeople);
      validation.minusCheck(rackRate);

      const rawRoomTypeData = await fsPromise.readFile(
         './files/room/roomType.json'
      );

      const RoomTypeData = JSON.parse(rawRoomTypeData);

      const isDuplicateRoomType = checkDuplicateRoomType(
         RoomTypeData.RoomTypes,
         roomTypeCode
      );

      if (isDuplicateRoomType) {
         throw createError(400, '이미 존재하는 객실타입');
      }

      const newRoomType = {
         roomTypeCode,
         roomTypeName,
         roomMaxPeople,
         rackRate,
      };
      RoomTypeData.RoomTypes.push(newRoomType);

      await fsPromise.writeFile(
         './files/room/roomType.json',
         JSON.stringify(RoomTypeData)
      );
      res.status(200).send('새로운 객실타입 생성 완료');
   } catch (err) {
      next(err);
   }
};

export const editRoomType = async (req, res, next) => {
   const { roomTypeCode, roomTypeName, roomMaxPeople, rackRate } = req.body;

   try {
      const rawRoomTypeData = await fsPromise.readFile(
         './files/room/roomType.json'
      );

      const RoomTypeData = JSON.parse(rawRoomTypeData);

      const roomTypeIndex = getRoomTypeIndex(
         RoomTypeData.RoomTypes,
         roomTypeCode
      );
      if (roomTypeIndex < 0) {
         throw createError(404, '존재하지 않는 객실타입');
      }

      const editRoomType = {
         roomTypeCode,
         roomTypeName,
         roomMaxPeople,
         rackRate,
      };

      RoomTypeData.RoomTypes[roomTypeIndex] = editRoomType;

      await fsPromise.writeFile(
         './files/room/roomType.json',
         JSON.stringify(RoomTypeData)
      );

      res.status(200).send(roomTypeCode + '타입 수정 완료');
   } catch (err) {
      next(err);
   }
};

export const deleteRoomType = async (req, res, next) => {
   const { roomTypeCode } = req.body;

   try {
      const rawRoomTypeData = await fsPromise.readFile(
         './files/room/roomType.json'
      );
      const RoomTypeData = JSON.parse(rawRoomTypeData);

      const isExistingRoomType = checkDuplicateRoomType(
         RoomTypeData.RoomTypes,
         roomTypeCode
      );
      if (!isExistingRoomType) {
         throw createError(404, '존재하지 않는 객실타입');
      }

      const roomTypeIndex = getRoomTypeIndex(
         RoomTypeData.RoomTypes,
         roomTypeCode
      );
      RoomTypeData.RoomTypes.splice(roomTypeIndex, 1);

      await fsPromise.writeFile(
         './files/room/roomType.json',
         JSON.stringify(RoomTypeData)
      );

      res.status(200).send(roomTypeCode + '타입 삭제 성공(roomType.json)');
   } catch (err) {
      next(err);
   }
};

export const createRooms = async (req, res, next) => {
   const { roomNumbers, roomTypeCode } = req.body;

   try {
      const rawRoomTypeData = await fsPromise.readFile(
         './files/room/roomType.json'
      );
      const RoomTypeData = JSON.parse(rawRoomTypeData);

      if (!roomTypeCode) {
         roomTypeCode = null;
      } else {
         const isExistingRoomType = checkDuplicateRoomType(
            RoomTypeData.RoomTypes,
            roomTypeCode
         );
         if (!isExistingRoomType) {
            throw createError(404, '존재하지 않는 객실타입');
         }
      }

      const rawRoomData = await fsPromise.readFile('./files/room/room.json');
      const RoomData = JSON.parse(rawRoomData);

      let successRoomNumbers = [];
      let failRoomNumbers = [];

      roomNumbers.forEach((newRoomNumber) => {
         let isExistingRoomIndex = RoomData.Rooms.findIndex((room) => {
            return room.roomNumber === newRoomNumber;
         });

         if (isExistingRoomIndex > 0) {
            failRoomNumbers.push(newRoomNumber);
         } else {
            successRoomNumbers.push(newRoomNumber);
            RoomData.Rooms.push({
               roomNumber: newRoomNumber,
               roomTypeCode: roomTypeCode,
            });
         }
      });
      if (failRoomNumbers.length === roomNumbers.length) {
         throw createError(400, '요청한 객실 모두 존재하는 객실');
      }

      await fsPromise.writeFile(
         './files/room/room.json',
         JSON.stringify(RoomData)
      );

      let successRoomNumber = '';
      let failRoomNumber = '';
      if (failRoomNumbers.length > 0) {
         successRoomNumbers.forEach((number) => {
            successRoomNumber += number.toString() + ' ';
         });
         failRoomNumbers.forEach((number) => {
            failRoomNumber += number.toString() + ' ';
         });
         res.status(200).send(
            `일부객실 생성에 성공하였습니다. \n 성공 : '${successRoomNumber} ' \n 실패 : '${failRoomNumber} '(이미 존재하는 객실)`
         );
      }
      res.status(200).send('객실 생성 성공');
   } catch (err) {
      next(err);
   }
};

export const editRoomTypeOfRooms = async (req, res, next) => {
   const { roomNumbers, roomTypeCode } = req.body;

   try {
      const rawRoomTypeData = await fsPromise.readFile(
         './files/room/roomType.json'
      );
      const RoomTypeData = JSON.parse(rawRoomTypeData);

      if (!roomTypeCode) {
         roomTypeCode = null;
      } else {
         const isExistingRoomType = checkDuplicateRoomType(
            RoomTypeData.RoomTypes,
            roomTypeCode
         );

         if (!isExistingRoomType) {
            throw createError(404, '존재하지 않는 객실타입');
         }
      }

      const rawRoomData = await fsPromise.readFile('./files/room/room.json');
      const RoomData = JSON.parse(rawRoomData);

      let successRoomNumbers = [];
      let failRoomNumbers = [];

      roomNumbers.forEach((editRoomNumber) => {
         let isExistingRoomIndex = RoomData.Rooms.findIndex((room) => {
            return room.roomNumber === editRoomNumber;
         });

         if (isExistingRoomIndex < 0) {
            failRoomNumbers.push(editRoomNumber);
         } else {
            successRoomNumbers.push(editRoomNumber);
            RoomData.Rooms[isExistingRoomIndex].roomTypeCode = roomTypeCode;
         }
      });

      if (failRoomNumbers.length === roomNumbers.length) {
         throw createError(400, '존재하지 않는 객실');
      }

      await fsPromise.writeFile(
         './files/room/room.json',
         JSON.stringify(RoomData)
      );

      let successRoomNumber = ' ';
      let failRoomNumber = ' ';
      if (failRoomNumbers.length > 0) {
         successRoomNumbers.forEach((number) => {
            successRoomNumber += number.toString() + ' ';
         });
         failRoomNumbers.forEach((number) => {
            failRoomNumber += number.toString() + ' ';
         });
         res.status(200).send(
            `일부객실 생성에 성공 \n 성공 : '${successRoomNumber}' \n 실패 : '${failRoomNumber}'(이미 존재하는 객실)`
         );
      }
      res.status(200).send('객실 생성 성공');
   } catch (err) {
      next(err);
   }
};

export const deleteRooms = async (req, res, next) => {
   const { roomNumbers } = req.body;

   try {
      const rawRoomData = await fsPromise.readFile('./files/room/room.json');
      const RoomData = JSON.parse(rawRoomData);

      let successRoomNumbers = [];
      let failRoomNumbers = [];

      roomNumbers.forEach((deleteRoomNumber) => {
         let isExistingRoomIndex = RoomData.Rooms.findIndex((room) => {
            return room.roomNumber === deleteRoomNumber;
         });
         if (isExistingRoomIndex < 0) {
            failRoomNumbers.push(deleteRoomNumber);
         } else {
            successRoomNumbers.push(deleteRoomNumber);
            RoomData.Rooms.splice(isExistingRoomIndex, 1);
         }
      });

      if (failRoomNumbers.length === roomNumbers.length) {
         throw createError(404, '존재하지 않는 객실.');
      }

      await fsPromise.writeFile(
         './files/room/room.json',
         JSON.stringify(RoomData)
      );

      let successRoomNumber = ' ';
      let failRoomNumber = ' ';
      if (failRoomNumbers.length > 0) {
         successRoomNumbers.forEach((number) => {
            successRoomNumber += number.toString() + ' ';
         });
         failRoomNumbers.forEach((number) => {
            failRoomNumber += number.toString() + ' ';
         });
         res.status(200).send(
            `일부객실 삭제에 성공 \n 성공 : '${successRoomNumber}' \n 실패 : '${failRoomNumber}'(존재하지 않은 객실)`
         );
      }
      res.status(200).send('객실 삭제 성공');
   } catch (err) {
      next(err);
   }
};

function getRoomTypeIndex(data, roomTypeCode) {
   const index = data.findIndex((roomType) => {
      return roomType.roomTypeCode === roomTypeCode;
   });
   return index;
}

function checkDuplicateRoomType(data, roomTypeCode) {
   return data.some((roomType) => {
      return roomType.roomTypeCode === roomTypeCode;
   });
}

function createError(status, message) {
   const error = new Error();
   error.status = status;
   error.message = message;
   return error;
}
