import * as validation from '../../source/js/function/validation/commonValidationFn.js';

export const createRoomTypeValidation = (req, res, next) => {
   try {
      const { roomTypeCode, roomMaxPeople, rackRate } = req.body;
      validation.roomTypeCodeCheck(roomTypeCode);
      if (roomMaxPeople)
         validation.numberCheck(roomMaxPeople, '객실 당 최대 투숙 인원');
      if (rackRate) validation.numberCheck(rackRate, '고정 객실료');
      next();
   } catch (err) {
      next(err);
   }
};

export const editRoomTypeValidation = (req, res, next) => {
   try {
      const { roomTypeCode, newRoomTypeCode, newRoomMaxPeople, newRackRate } =
         req.body;
      validation.roomTypeCodeCheck(roomTypeCode);
      if (newRoomTypeCode) validation.roomTypeCodeCheck(newRoomTypeCode);
      if (newRoomMaxPeople)
         validation.numberCheck(newRoomMaxPeople, '객실 당 최대 투숙 인원');
      if (newRackRate) validation.numberCheck(newRackRate, '고정 객실료');
      next();
   } catch (err) {
      next(err);
   }
};

export const checkRoomTypeCodeValidationOnly = (req, res, next) => {
   try {
      const { roomTypeCode } = req.body;
      validation.roomTypeCodeCheck(roomTypeCode);
      next();
   } catch (err) {
      next(err);
   }
};
