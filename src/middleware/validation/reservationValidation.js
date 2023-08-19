import { createError } from '../../source/js/function/commonFn.js';
import * as validation from '../../source/js/function/validation/commonValidationFn.js';

export const createRsvnValidation = (req, res, next) => {
   try {
      const {
         arrivalDate,
         departureDate,
         numberOfGuests,
         guestName,
         tel1,
         tel2,
         reservatorName,
         reservatorTel,
         arrivalTime,
         departureTime,
         reference,
         roomTypeCode,
         rateTypeCode,
         roomChargeDatas,
      } = req.body;

      validation.rsvnDateCheck(arrivalDate, departureDate);
      validation.roomTypeCodeCheck(roomTypeCode);
      validation.rateTypeCodeCheck(rateTypeCode);
      validation.nameCheck(guestName);
      Array.isArray(roomChargeDatas)
         ? roomChargeDatas.forEach((data) => {
              data.date && data.roomRateId
                 ? validation.dateCheck(data.date)
                 : () => {
                      throw createError(422, '일별객실요금 입력오류');
                   };

              if (data.fixedRoomCharge)
                 validation.numberCheck(data.fixedRoomCharge);
           })
         : () => {
              throw createError(422, '일별객실요금 입력오류(배열이 아님)');
           };

      if (tel1) validation.telCheck(tel1);
      if (tel2) validation.telCheck(tel2);
      if (numberOfGuests) validation.numberCheck(numberOfGuests, '인원 수');
      if (reservatorName) validation.nameCheck(reservatorName);
      if (reservatorTel) validation.telCheck(reservatorTel);
      if (arrivalTime) validation.timeCheck(arrivalTime);
      if (departureTime) validation.timeCheck(departureTime);
      if (reference) validation.referenceCheck(reference);
      next();
   } catch (err) {
      next(err);
   }
};

export const getRsvnsInFilterOptionsValidation = (req, res, next) => {
   try {
      const {
         status,
         cautionYN,
         roomTypeCodes,
         rateTypeCodes,
         arrivalStartDate,
         arrivalEndDate,
         departureStartDate,
         departureEndDate,
         createStartDate,
         createEndDate,
      } = req.query;

      if (status) {
         status.split(',').forEach((code) => {
            validation.statusCheck(code);
         });
      }

      if (cautionYN) validation.yesOrNoCheck(cautionYN, '주의여부');

      if (roomTypeCodes) {
         roomTypeCodes.split(',').forEach((code) => {
            validation.roomTypeCodeCheck(code);
         });
      }

      if (roomTypeCodes) {
         rateTypeCodes.split(',').forEach((code) => {
            validation.rateTypeCodeCheck(code);
         });
      }

      if (arrivalStartDate || arrivalEndDate) {
         const { adjustedArrStartDate, adjustedArrEndDate } =
            validation.dateSearchOptionsCheck(arrivalStartDate, arrivalEndDate);
         req.query.arrivalStartDate = adjustedArrStartDate;
         req.query.arrivalEndDate = adjustedArrEndDate;
      }

      if (departureStartDate || departureEndDate) {
         const { adjustedDepStartDate, adjustedDepEndDate } =
            validation.dateSearchOptionsCheck(
               departureStartDate,
               departureEndDate
            );
         req.query.arrivalStartDate = adjustedDepStartDate;
         req.query.arrivalEndDate = adjustedDepEndDate;
      }

      if (createStartDate || createEndDate) {
         const { adjustedCreateStartDate, adjustedCreateEndDate } =
            validation.dateSearchOptionsCheck(createStartDate, createEndDate);
         req.query.createStartDate = adjustedCreateStartDate;
         req.query.createEndDate = adjustedCreateEndDate;
      }
      next();
   } catch (err) {
      next(err);
   }
};

export const checkRsvnIdValidationOnly = (req, res, next) => {
   try {
      const { id } = req.query;
      validation.idCheck(id, '예약번호');
      next();
   } catch (err) {
      next(err);
   }
};

export const editRsvnValidation = (req, res, next) => {
   try {
      const {
         rsvnId,
         statusCode,
         arrivalDate,
         departureDate,
         numberOfGuests,
         guestName,
         tel1,
         tel2,
         caller,
         callerTel,
         arrivalTime,
         departureTime,
         reference,
         roomTypeCode,
         rateTypeCode,
      } = req.body;
      validation.idCheck(rsvnId, '예약번호');
      if (statusCode) validation.statusCheck(statusCode);
      if (arrivalDate) validation.rsvnDateCheck(arrivalDate);
      if (departureDate) validation.rsvnDateCheck(departureDate);
      if (guestName) validation.nameCheck(guestName);
      if (numberOfGuests) validation.numberCheck(numberOfGuests, '인원 수');
      if (tel1) validation.telCheck(tel1);
      if (tel2) validation.telCheck(tel2);
      if (caller) validation.nameCheck(caller);
      if (callerTel) validation.telCheck(callerTel);
      if (arrivalTime) validation.timeCheck(arrivalTime);
      if (departureTime) validation.timeCheck(departureTime);
      if (reference) validation.referenceCheck(reference);
      if (roomTypeCode) validation.roomTypeCodeCheck(roomTypeCode);
      if (rateTypeCode) validation.rateTypeCodeCheck(rateTypeCode);
      next();
   } catch (err) {
      next(err);
   }
};

// export const editStatusOnlyValidation = (req, res, next) => {
//    try {
//       const { rsvnId, status } = req.body;
//       validation.idCheck(rsvnId, '예약 번호');
//       validation.statusCheck(status);
//       next();
//    } catch (err) {
//       next(err);
//    }
// };

export const assignRoomToRsvnValidation = async (req, res, next) => {
   try {
      const { id, roomNumber } = req.body.idAndRoomPairs[0];
      validation.idCheck(id, '예약번호');
      validation.numberCheck(roomNumber, '객실번호');
      next();
   } catch (err) {
      next(err);
   }
};

// export const createMemoValidation = (req, res, next) => {
//    try {
//       if (!req.body.memoTitle) throw createError(400, '메모 제목 미입력');
//       validation.memoTitleCheck(req.body.memoTitle);

//       if (!req.body.memoContent) throw createError(400, '메모 내용 미입력');
//       next();
//    } catch (err) {
//       next(err);
//    }
// };
