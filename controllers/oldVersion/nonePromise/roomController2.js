import fs from 'fs';

function getData(res, filePath) {
   let data;
   try {
      data = fs.readFileSync(filePath);
   } catch (err) {
      res.status(500).send('DB로부터의 송신에 실패했습니다.');
      return;
   }

   const parsedData = JSON.parse(data);
   return parsedData;
}

function saveData(res, data, filePath) {
   try {
      fs.writeFileSync(filePath, JSON.stringify(data));
   } catch (err) {
      res.status(500).send('DB로의 저장에 실패했습니다.');
      return;
   }
}

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

export const createRoomType = (req, res) => {
   const { roomTypeCode, roomTypeName, roomMaxPeople, rackRate } = req.body;

   const roomTypeData = getData(res, './files/room/roomType.json');

   //roomTypeCode와 동일한 코드의 타입이 있는지 검사
   const isDuplicateRoomType = checkDuplicateRoomType(
      roomTypeData.RoomTypes,
      roomTypeCode
   );
   if (isDuplicateRoomType) {
      res.status(400).send('이미 존재하는 객실타입입니다.');
      return;
   }

   const newRoomType = {
      roomTypeCode,
      roomTypeName,
      roomMaxPeople,
      rackRate,
   };
   roomTypeData.RoomTypes.push(newRoomType);

   saveData(res, roomTypeData, './files/room/roomType.json');
   res.status(201).send(roomTypeCode + '타입 생성이 완료되었습니다.');
};

export const editRoomType = (req, res) => {
   const { roomTypeCode, roomTypeName, roomMaxPeople, rackRate } = req.body;

   const roomTypeData = getData(res, './files/room/roomType.json');

   const roomTypeIndex = getRoomTypeIndex(roomTypeData.RoomTypes, roomTypeCode);
   if (roomTypeIndex < 0) {
      res.status(400).send('존재하지 않는 객실타입입니다.');
      return;
   }

   const editRoomType = { roomTypeCode, roomTypeName, roomMaxPeople, rackRate };

   roomTypeData.RoomTypes[roomTypeIndex] = editRoomType;

   saveData(res, roomTypeData, './files/room/roomType.json');
   res.status(201).send(roomTypeCode + '타입 변경이 완료되었습니다.');
};

export const deleteRoomType = (req, res) => {
   const { roomTypeCode } = req.body;

   const roomTypeData = getData(res, './files/room/roomType.json');

   const isExistingRoomType = checkDuplicateRoomType(
      roomTypeData.RoomTypes,
      roomTypeCode
   );
   if (!isExistingRoomType) {
      res.status(400).send('존재하지 않는 객실타입입니다.');
      return;
   }

   const roomTypeIndex = getRoomTypeIndex(roomTypeData.RoomTypes, roomTypeCode);
   roomTypeData.RoomTypes.splice(roomTypeIndex, 1);

   const roomData = getData(res, './files/room/room.json');
   roomData.Rooms.forEach((room) => {
      if (room.roomTypeCode === roomTypeCode) {
         room.roomTypeCode = null;
      }
   });

   saveData(res, roomTypeData, './files/room/roomType.json');
   saveData(res, roomData, './files/room/room.json');
   res.status(201).send(roomTypeCode + '타입 삭제가 완료되었습니다.');
};

export const createRooms = (req, res) => {
   const { roomNumbers, roomTypeCode } = req.body;

   const roomData = getData(res, './files/room/room.json');
   const roomTypeData = getData(res, './files/room/roomType.json');

   const isDuplicateRoomType = checkDuplicateRoomType(
      roomTypeData.RoomTypes,
      roomTypeCode
   );

   if (!isDuplicateRoomType) {
      res.status(400).send('존재하지 않는 객실타입입니다.');
      return;
   }

   let successRoomNumbers = [];
   let failRoomNumbers = [];

   roomNumbers.forEach((newRoomNumber) => {
      let isExistingRoomIndex = roomData.Rooms.findIndex((room) => {
         return room.roomNumber === newRoomNumber;
      });

      if (isExistingRoomIndex > 0) {
         failRoomNumbers.push(newRoomNumber);
      } else {
         successRoomNumbers.push(newRoomNumber);
         roomData.Rooms.push({
            roomNumber: newRoomNumber,
            roomTypeCode: roomTypeCode,
         });
      }
   });

   if (failRoomNumbers.length === roomNumbers.length) {
      res.status(400).send('존재하는 객실이 없습니다.');
      return;
   }

   saveData(res, roomData, './files/room/room.json');

   if (failRoomNumbers.length > 0) {
      let successRoomNumber, failRoomNumber;
      successRoomNumbers.forEach((number) => {
         successRoomNumber += `${number} `;
      });
      failRoomNumbers.forEach((number) => {
         failRoomNumber += `${number} `;
      });
      res.status(200).send(
         `일부객실 생성에 성공하였습니다. \n 성공 : '${successRoomNumber}' \n 실패 : '${failRoomNumber}'`
      );
      return;
   }
   res.status(200).send('객실생성에 성공하였습니다.');
};

export const editRoomTypeOfRooms = (req, res) => {
   const { roomNumbers, roomTypeCode } = req.body;

   const roomData = getData(res, './files/room/room.json');

   if (!roomTypeCode) {
      res.status(404).send('변경할 객실타입을 입력하세요.');
   }

   let successRoomNumbers = [];
   let failRoomNumbers = [];

   roomNumbers.forEach((editRoomNumber) => {
      let isExistingRoomIndex = roomData.Rooms.findIndex((room) => {
         return room.roomNumber === editRoomNumber;
      });

      if (isExistingRoomIndex < 0) {
         failRoomNumbers.push(editRoomNumber);
      } else {
         successRoomNumbers.push(editRoomNumber);
         roomData.Rooms[isExistingRoomIndex].roomTypeCode = roomTypeCode;
      }
   });

   if (failRoomNumbers.length === roomNumbers.length) {
      res.status(400).send('존재하는 객실이 없습니다.');
      return;
   }

   saveData(res, roomData, './files/room/room.json');

   if (failRoomNumbers.length > 0) {
      let successRoomNumber, failRoomNumber;
      successRoomNumbers.forEach((number) => {
         successRoomNumber += `${number} `;
      });
      failRoomNumbers.forEach((number) => {
         failRoomNumber += `${number} `;
      });
      res.status(200).send(
         `일부객실 변경에 성공하였습니다. \n 성공 : '${successRoomNumber}' \n 실패 : '${failRoomNumber}'`
      );
      return;
   }
   res.status(200).send('변경에 성공하였습니다.');
};

export const deleteRooms = (req, res) => {
   const { roomNumbers } = req.body;
   const roomData = getData(res, './files/room/room.json');

   let successRoomNumbers = [];
   let failRoomNumbers = [];

   roomNumbers.forEach((deleteRoomNumber) => {
      let isExistingRoomIndex = roomData.Rooms.findIndex((room) => {
         return room.roomNumber === deleteRoomNumber;
      });

      if (isExistingRoomIndex < 0) {
         failRoomNumbers.push(deleteRoomNumber);
      } else {
         successRoomNumbers.push(deleteRoomNumber);
         roomData.Rooms.splice(isExistingRoomIndex, 1);
      }
   });

   if (failRoomNumbers.length === roomNumbers.length) {
      res.status(400).send('존재하는 객실이 없습니다.');
      return;
   }

   saveData(res, roomData, './files/room/room.json');

   if (failRoomNumbers.length > 0) {
      let successRoomNumber, failRoomNumber;
      successRoomNumbers.forEach((number) => {
         successRoomNumber += `${number} `;
      });
      failRoomNumbers.forEach((number) => {
         failRoomNumber += `${number} `;
      });
      res.status(200).send(
         `일부객실 삭제에 성공하였습니다. \n 성공 : '${successRoomNumber}' \n 실패 : '${failRoomNumber}'`
      );
      return;
   }
   res.status(200).send('객실삭제에 성공하였습니다.');
};
