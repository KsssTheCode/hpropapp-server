import fsPromise from 'fs/promises';
import * as validation from '../middleware/validation.js';

export const createRoomType = (req, res, next) => {
   const { roomTypeCode, roomTypeName, roomMaxPeople, rackRate } = req.body;

   validation.roomTypeCodeCheck(roomTypeCode);
   validation.minusCheck(roomMaxPeople);
   validation.minusCheck(rackRate);

   fsPromise
      .readFile('./files/room/roomType.json')
      .then((rawData) => {
         const RoomTypeData = JSON.parse(rawData);
         const isDuplicateRoomType = checkDuplicateRoomType(
            RoomTypeData.RoomTypes,
            roomTypeCode
         );

         if (isDuplicateRoomType) {
            const error = new Error();
            error.message = '이미 존재하는 객실타입';
            error.status = 400;
            throw error;
         }

         const newRoomType = {
            roomTypeCode,
            roomTypeName,
            roomMaxPeople,
            rackRate,
         };
         RoomTypeData.RoomTypes.push(newRoomType);
         return fsPromise.writeFile(
            './files/room/roomType.json',
            JSON.stringify(RoomTypeData)
         );
      })
      .catch((error) => {
         next(error);
         return Promise.reject();
      })
      .then(() => {
         res.status(200).send('새로운 객실타입 생성 완료');
      })
      .catch((error) => {
         next(error);
      });
};

export const editRoomType = (req, res, next) => {
   const { roomTypeCode, roomTypeName, roomMaxPeople, rackRate } = req.body;

   fsPromise
      .readFile('./files/room/roomType.json')
      .then((rawData) => {
         const RoomTypeData = JSON.parse(rawData);
         const roomTypeIndex = getRoomTypeIndex(
            RoomTypeData.RoomTypes,
            roomTypeCode
         );
         if (roomTypeIndex < 0) {
            const error = new Error();
            error.message = '존재하지 않는 객실타입';
            error.status = 404;
            throw error;
         }

         const editRoomType = {
            roomTypeCode,
            roomTypeName,
            roomMaxPeople,
            rackRate,
         };

         RoomTypeData.RoomTypes[roomTypeIndex] = editRoomType;

         return fsPromise.writeFile(
            './files/room/roomType.json',
            JSON.stringify(RoomTypeData)
         );
      })
      .catch((error) => {
         next(error);
         return Promise.reject();
      })
      .then(() => {
         res.status(200).send(roomTypeCode + '타입 수정 완료');
      })
      .catch((error) => {
         next(error);
      });
};

export const deleteRoomType = (req, res, next) => {
   const { roomTypeCode } = req.body;

   fsPromise
      .readFile('./files/room/roomType.json')
      .then((rawData) => {
         const RoomTypeData = JSON.parse(rawData);

         const isExistingRoomType = checkDuplicateRoomType(
            RoomTypeData.RoomTypes,
            roomTypeCode
         );
         if (!isExistingRoomType) {
            const error = new Error();
            error.message = '존재하지 않는 객실타입';
            error.status = 404;
            throw error;
         }

         const roomTypeIndex = getRoomTypeIndex(
            RoomTypeData.RoomTypes,
            roomTypeCode
         );
         RoomTypeData.RoomTypes.splice(roomTypeIndex, 1);

         return fsPromise.writeFile(
            './files/room/roomType.json',
            JSON.stringify(RoomTypeData)
         );
      })
      .catch((error) => {
         next(error);
         return Promise.reject();
      })
      .then(() => {
         res.status(200).send(roomTypeCode + '타입 삭제 성공(roomType.json)');
      })
      .catch((error) => {
         error.message = '파일 전송 실패(roomType.json)';
         next(error);
      });

   fsPromise
      .readFile('./files/room/room.json')
      .then((rawData) => {
         const RoomData = JSON.parse(rawData);

         RoomData.Rooms.forEach((room) => {
            if (room.roomTypeCode === roomTypeCode) {
               room.roomTypeCode = null;
            }
         });

         return fsPromise.writeFile(
            './files/room/room.json',
            JSON.stringify(RoomData)
         );
      })
      .catch((error) => {
         next(error);
         return Promise.reject();
      })
      .then(() => {
         res.status(200).send(roomTypeCode + '타입 삭제 성공(room.json)');
      })
      .catch((error) => {
         error.message = '파일 전송 실패(room.json)';
         next(error);
      });
};

export const createRooms = (req, res, next) => {
   const { roomNumbers, roomTypeCode } = req.body;

   let successRoomNumbers = [];
   let failRoomNumbers = [];

   fsPromise
      .readFile('./files/room/roomType.json')
      .then((rawData) => {
         const RoomTypeData = JSON.parse(rawData);

         if (!roomTypeCode) {
            roomTypeCode = null;
         } else {
            const isExistingRoomType = checkDuplicateRoomType(
               RoomTypeData.RoomTypes,
               roomTypeCode
            );
            if (!isExistingRoomType) {
               const error = new Error();
               error.status = 404;
               error.message = '존재하지 않는 객실타입입니다.';
               throw error;
            }
         }

         return fsPromise.readFile('./files/room/room.json');
      })
      .catch((error) => {
         next(error);
         return Promise.reject();
      })
      .then((rawData) => {
         const RoomData = JSON.parse(rawData);

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
            const error = new Error();
            error.status = 400;
            error.message = '이미 모두 존재하는 객실입니다.';
            throw error;
         }

         return fsPromise.writeFile(
            './files/room/room.json',
            JSON.stringify(RoomData)
         );
      })
      .catch((error) => {
         next(error);
         return Promise.reject();
      })
      .then(() => {
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
               `일부객실 생성에 성공하였습니다. \n 성공 : '${successRoomNumber}' \n 실패 : '${failRoomNumber}'(이미 존재하는 객실)`
            );
         }
         res.status(200).send('객실 생성 성공');
      })
      .catch((error) => {
         next(error);
      });
};

export const editRoomTypeOfRooms = (req, res, next) => {
   const { roomNumbers, roomTypeCode } = req.body;

   let successRoomNumbers = [];
   let failRoomNumbers = [];

   fsPromise
      .readFile('./files/room/roomType.json')
      .then((rawData) => {
         const RoomTypeData = JSON.parse(rawData);

         if (!roomTypeCode) {
            roomTypeCode = null;
         } else {
            const isExistingRoomType = checkDuplicateRoomType(
               RoomTypeData.RoomTypes,
               roomTypeCode
            );

            if (!isExistingRoomType) {
               const error = new Error();
               error.status = 404;
               error.message = '존재하지 않는 객실타입입니다.';
               throw error;
            }
         }

         return fsPromise.readFile('./files/room/room.json');
      })
      .catch((error) => {
         next(error);
         return Promise.reject();
      })
      .then((rawData) => {
         const RoomData = JSON.parse(rawData);

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
            const error = new Error();
            error.status = 400;
            error.message = '존재하는 객실이 없습니다.';
            throw error;
         }

         return fsPromise.writeFile(
            './files/room/room.json',
            JSON.stringify(RoomData)
         );
      })
      .catch((error) => {
         next(error);
         return Promise.reject();
      })
      .then(() => {
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
      })
      .catch((error) => {
         next(error);
      });
};

export const deleteRooms = (req, res, next) => {
   const { roomNumbers } = req.body;

   let successRoomNumbers = [];
   let failRoomNumbers = [];

   fsPromise
      .readFile('./files/room/room.json')
      .then((rawData) => {
         const RoomData = JSON.parse(rawData);

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
            const error = new Error();
            error.status = 404;
            error.message = '존재하는 객실이 없습니다.';
            throw error;
         }

         return fsPromise.writeFile(
            './files/room/room.json',
            JSON.stringify(RoomData)
         );
      })
      .catch((error) => {
         next(error);
         return Promise.reject();
      })
      .then(() => {
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
      })
      .catch((error) => {
         next(error);
      });
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
