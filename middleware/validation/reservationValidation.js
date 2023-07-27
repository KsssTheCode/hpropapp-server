import { createError } from '../../source/js/function/commonFn.js';
import * as validation from '../../source/js/function/validation/commonValidationFn.js';
import { rsvnDateCheck } from '../../source/js/function/validation/reservationValidationFn.js';

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

      rsvnDateCheck(arrivalDate, departureDate);
      validation.roomTypeCodeCheck(roomTypeCode);
      validation.rateTypeCodeCheck(rateTypeCode);
      validation.nameCheck(guestName);
      Array.isArray(roomChargeDatas)
         ? roomChargeDatas.forEach((data) => {
              data.date && data.roomRateId
                 ? validation.dateCheck(data.date)
                 : () => {
                      throw createError(400, '일별객실요금 입력오류');
                   };

              if (data.fixedRoomCharge)
                 validation.numberCheck(data.fixedRoomCharge);
           })
         : () => {
              throw createError(400, '일별객실요금 입력오류(배열이 아님)');
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

export const getRsvnsInOptionsValidation = (req, res, next) => {
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
         const statusArr = status.split(',');
         statusArr.forEach((code) => {
            validation.statusCheck(code);
         });
         req.query.status = statusArr;
      }

      if (cautionYN) validation.yesOrNoCheck(cautionYN, '주의여부');

      if (roomTypeCodes) {
         const roomTypeCodesArr = roomTypeCodes.split(',');
         roomTypeCodesArr.forEach((code) => {
            validation.roomTypeCodeCheck(code);
         });
         req.query.roomTypeCodes = roomTypeCodesArr;
      }

      if (roomTypeCodes) {
         const rateTypeCodesArr = rateTypeCodes.split(',');
         rateTypeCodesArr.forEach((code) => {
            validation.rateTypeCodeCheck(code);
         });
         req.query.roomTypeCodes = rateTypeCodesArr;
      }

      if (arrivalStartDate && arrivalEndDate) {
         validation.dateCheck(arrivalStartDate);
         validation.dateCheck(arrivalEndDate);
         if (arrivalStartDate > arrivalEndDate)
            throw createError(
               400,
               '검색 시작일이 검색 종료일보다 늦을 수 없음'
            );
      } else if (arrivalStartDate && !arrivalEndDate) {
         validation.dateCheck(arrivalStartDate);
         req.query.arrivalEndDate = arrivalStartDate;
      } else if (!arrivalStartDate && arrivalEndDate) {
         validation.dateCheck(arrivalEndDate);
         req.query.arrivalStartDate = arrivalEndDate;
      }

      if (departureStartDate && departureEndDate) {
         validation.dateCheck(departureStartDate);
         validation.dateCheck(departureEndDate);
         if (departureStartDate > departureEndDate)
            throw createError(
               400,
               '검색 시작일이 검색 종료일보다 늦을 수 없음'
            );
      } else if (departureStartDate && !departureEndDate) {
         validation.dateCheck(departureStartDate);
         req.query.departureEndDate = departureStartDate;
      } else if (!departureStartDate && departureEndDate) {
         validation.dateCheck(departureEndDate);
         req.query.departureStartDate = departureEndDate;
      }

      if (createStartDate && createEndDate) {
         validation.dateCheck(createStartDate);
         validation.dateCheck(createEndDate);
         if (+createStartDate > +createEndDate)
            throw createError(
               400,
               '검색 시작일이 검색 종료일보다 늦을 수 없음'
            );
      } else if (createStartDate && !createEndDate) {
         req.query.createEndDate = createStartDate;
      } else if (!createStartDate && createEndDate) {
         req.query.createStartDate = createEndDate;
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
      if (arrivalDate) rsvnDateCheck(arrivalDate);
      if (departureDate) rsvnDateCheck(departureDate);
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

export const editStatusOnlyValidation = (req, res, next) => {
   try {
      const { rsvnId, status } = req.body;
      validation.idCheck(rsvnId, '예약 번호');
      validation.statusCheck(status);
      next();
   } catch (err) {
      next(err);
   }
};

export const createMemoValidation = (req, res, next) => {
   try {
      if (!req.body.memoTitle) throw createError(400, '메모 제목 미입력');
      validation.memoTitleCheck(req.body.memoTitle);

      if (!req.body.memoContent) throw createError(400, '메모 내용 미입력');
      next();
   } catch (err) {
      next(err);
   }
};
