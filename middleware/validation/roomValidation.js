import * as validation from '../../source/js/function/validation/commonValidationFn.js';

export const createEditDeleteRoomValidation = (req, res, next) => {
   try {
      const { roomTypeCode, roomNumbers } = req.body;

      validation.roomTypeCodeCheck(roomTypeCode);

      Array.isArray(roomNumbers)
         ? roomNumbers.forEach((number) => {
              validation.numberCheck(number, '객실호수');
           })
         : () => {
              throw createError(400, '객실호수 입력오류(배열이 아님)');
           };
      next();
   } catch (err) {
      next(err);
   }
};

export const assignRoomValidation = (req, res, next) => {
   try {
      const { roomNumber, rsvnId } = req.body;
      validation.idCheck(rsvnId, '예약번호');
      validation.numberCheck(roomNumber);
      next();
   } catch (err) {
      next(err);
   }
};

export const getRoomsForPreviewInOptionsValidation = (req, res, next) => {
   try {
      const { floors, cleanStatusCodes, groupIds, assignYN, roomTypeCodes } =
         req.body;

      if (groupIds)
         Array.isArray(groupIds)
            ? groupIds.forEach((id) => {
                 validation.idCheck(id);
              })
            : () => {
                 throw createError(400, '단체번호 입력오류(배열이 아님)');
              };

      if (floors)
         floors.forEach((number) => {
            validation.numberCheck(number);
         });

      if (cleanStatusCodes)
         Array.isArray(cleanStatusCodes)
            ? cleanStatusCodes.forEach((code) => {
                 validation.cleanStatusCodeCheck(code);
              })
            : () => {
                 throw createError(400, '정비상태 입력오류(배열이 아님)');
              };

      if (assignYN) validation.yesOrNoCheck(assignYN);

      if (roomTypeCodes)
         Array.isArray(roomTypeCodes)
            ? roomTypeCodes.forEach((code) => {
                 validation.roomTypeCodeCheck(code);
              })
            : () => {
                 throw createError(400, '객실타입 입력오류(배열이 아님)');
              };
      next();
   } catch (err) {
      next(err);
   }
};
