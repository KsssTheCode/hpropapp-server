jest.mock('axios');

const createConfig = (method, urlDetail, data) => {
   return {
      method: method,
      url: url + urlDetail,
      data: data,
   };
};

describe('Room', () => {
   describe('Room - CreateRoomType', () => {
      test('roomTypeCode 미입력', () => {
         expect(roomController.createRoomType({}).toStrictEqual());
      });

      test('roomTypeCode 양식오류 ', () => {
         expect(roomController.createRoomType({}).toStrictEqual());
      });

      test('이미 존재하는 roomTypeCode', () => {
         expect(roomController.createRoomType({}).toStrictEqual());
      });

      test('rackRate < 0', () => {
         expect(roomController.createRoomType({}).toStrictEqual());
      });

      test('roomMaxPeople < 0', () => {
         expect(roomController.createRoomType({}).toStrictEqual());
      });
   });

   describe('Room - EditRoomType', () => {
      test('roomTypeCode 미입력', () => {
         expect(roomController.createRoomType({}).toStrictEqual());
      });

      test('roomTypeCode 양식오류 ', () => {
         expect(roomController.createRoomType({}).toStrictEqual());
      });

      test('존재하지 않는 roomTypeCode', () => {
         expect(roomController.editRoomType({}).toStrictEqual());
      });

      test('rackRate < 0', () => {
         expect(roomController.createRoomType({}).toStrictEqual());
      });

      test('roomMaxPeople < 0', () => {
         expect(roomController.createRoomType({}).toStrictEqual());
      });
   });

   describe('Room - DeleteRoomType', () => {
      test('roomTypeCode 미입력', () => {
         expect(roomController.createRoomType({}).toStrictEqual());
      });

      test('roomTypeCode 양식오류 ', () => {
         expect(roomController.createRoomType({}).toStrictEqual());
      });

      test('존재하지 않는 roomTypeCode', () => {
         expect(roomController.deleteRoomType({}).toStrictEqual());
      });
   });

   describe('Room - CreateRooms', () => {
      test('roomNumbers 미입력', () => {
         expect(roomController.createRooms({}).toStrictEqual());
      });

      test('roomNumbers가 배열이 아닌 경우', () => {
         expect(roomController.createRooms({}).toStrictEqual());
      });

      test('roomNumbers 중 일치하는 객실이 하나도 없는 경우', () => {
         expect(roomController.createRooms({}).toStrictEqual());
      });

      test('roomTypeCode 미입력', () => {
         expect(roomController.createRoomType({}).toStrictEqual());
      });

      test('roomTypeCode 양식오류', () => {
         expect(roomController.createRoomType({}).toStrictEqual());
      });

      test('존재하지 않는 roomTypeCode', () => {
         expect(roomController.deleteRoomType({}).toStrictEqual());
      });
   });

   describe('Room - EditRoomTypeOfRooms', () => {
      test('roomNumbers 미입력', () => {
         expect(roomController.createRooms({}).toStrictEqual());
      });

      test('roomNumbers가 배열이 아닌 경우', () => {
         expect(roomController.createRooms({}).toStrictEqual());
      });

      test('roomNumbers 중 일치하는 객실이 하나도 없는 경우', () => {
         expect(roomController.createRooms({}).toStrictEqual());
      });

      test('roomTypeCode 미입력', () => {
         expect(roomController.createRoomType({}).toStrictEqual());
      });

      test('roomTypeCode 양식오류', () => {
         expect(roomController.createRoomType({}).toStrictEqual());
      });

      test('존재하지 않는 roomTypeCode', () => {
         expect(roomController.deleteRoomType({}).toStrictEqual());
      });
   });

   describe('Room - DeleteRooms', () => {
      test('roomNumbers 미입력', () => {
         expect(roomController.createRooms({}).toStrictEqual());
      });

      test('roomNumbers가 배열이 아닌 경우', () => {
         expect(roomController.createRooms({}).toStrictEqual());
      });

      test('roomNumbers 중 일치하는 객실이 하나도 없는 경우', () => {
         expect(roomController.createRooms({}).toStrictEqual());
      });
   });
});
