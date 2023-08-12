import { createError } from '../../source/js/function/commonFn.js';
import * as validation from '../../source/js/function/validation/commonValidationFn.js';
import { rsvnDateCheck } from '../../source/js/function/validation/reservationValidationFn.js';

export const createGroupRsvnWithDetailRsvnsValidation = (req, res, next) => {
   try {
      const {
         arrivalDate,
         departureDate,
         arrivalTime,
         departureTime,
         groupName,
         leaderName,
         leaderTel,
         companyName,
         companyTel,
         groupId,
      } = req.body.group;

      const detailsData = req.body.detail.map((rsvn) => {
         return { detailArr: rsvn.arrivalDate, detailDep: rsvn.departureDate };
      });
      rsvnDateCheck(detailsData.detailArr, detailsData.detailDep);
      rsvnDateCheck(arrivalDate, departureDate);
      if (
         arrivalDate < detailsData.detailArr ||
         departureDate < detailsData.detailDep
      ) {
         throw createError(
            400,
            '세부 예약건은 마스터 예약건의 기간 내에 존재해야 합니다.'
         );
      }

      validation.groupNameCheck(groupName);
      if (leaderName) validation.nameCheck(leaderName);
      if (leaderTel) validation.telCheck(leaderTel);
      if (arrivalTime) validation.timeCheck(arrivalTime);
      if (departureTime) validation.timeCheck(departureTime);
      if (companyName) validation.groupNameCheck(companyName);
      if (companyTel) validation.telCheckNotForPhone(companyTel);
      if (groupId) validation.idCheck(groupId, '그룹번호');
      next();
   } catch (err) {
      next(err);
   }
};

export const createDetailRsvnsOfGroupRsvn = (req, res, next) => {
   try {
      const { groupRsvnId, detailRsvns } = req.body;
      validation.idCheck(groupRsvnId);

      Array.isArray(detailRsvns)
         ? detailRsvns.forEach((rsvn) => {
              rsvnDateCheck(rsvn.arrivalDate, rsvn.departureDate);
              guestName
                 ? validation.nameCheck(rsvn.guestName)
                 : (rsvn.guestName = groupName);
              if (rsvn.numberOfGuests) validation.numberCheck(numberOfGuests);
              validation.roomTypeCodeCheck(rsvn.roomTypeCode);
              validation.rateTypeCodeCheck(rsvn.rateTypeCode);
           })
         : () => {
              throw createError(400, '세부예약건 입력오류(배열이 아님)');
           };
   } catch (err) {
      next(err);
   }
};

export const checkGroupRsvnIdValidationOnly = (req, res, next) => {
   try {
      const { id } = req.query;
      validation.idCheck(id, '그룹아이디');
      next();
   } catch (err) {
      next(err);
   }
};

export const getGroupRsvnsInOptionsValidation = (req, res, next) => {
   try {
      const {
         status,
         arrivalStartDate,
         arrivalEndDate,
         departureStartDate,
         departureEndDate,
         createStartDate,
         createEndDate,
      } = req.body;

      if (status) {
         const statusArr = status.split(',');
         statusArr.forEach((code) => {
            validation.statusCheck(code);
         });
         req.query.status = statusArr;
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

export const editGroupRsvnValidation = (req, res, next) => {
   try {
      const {
         status,
         arrivalDate,
         departureDate,
         leaderName,
         leaderTel,
         companyName,
         companyTel,
         detailRsvns,
      } = req.body;
      if (status) validation.statusCheck(status);

      //arrivalDate와 departureDate는 어느 하나라도 바뀐다면 모든 둘 다 매개변수로써 받아와야함
      switch (true) {
         case arrivalDate && !departureDate:
            validation.dateCheck(arrivalDate);
            break;
         case !arrivalDate && departureDate:
            validation.dateCheck(departureDate);
            break;
         case arrivalDate && departureDate:
            rsvnDateCheck(arrivalDate, departureDate);
      }

      if (leaderName) validation.nameCheck(leaderName);
      if (leaderTel) validation.telCheck(leaderTel);
      if (companyName) validation.groupNameCheck(companyName);
      if (companyTel) validation.telCheck(companyTel);

      detailRsvns.forEach((rsvn) => {
         if (rsvn.status) validation.statusCheck(rsvn.status);
         switch (true) {
            case rsvn.arrivalDate && !rsvn.departureDate:
               validation.dateCheck(rsvn.arrivalDate);
               break;
            case !rsvn.arrivalDate && rsvn.departureDate:
               validation.dateCheck(rsvn.departureDate);
               break;
            case rsvn.arrivalDate && rsvn.departureDate:
               rsvnDateCheck(rsvn.arrivalDate, rsvn.departureDate);
         }
         if (rsvn.guestName) validation.groupNameCheck(rsvn.guestName);
         if (rsvn.roomTypeCode) validation.roomTypeCodeCheck(rsvn.roomTypeCode);
         if (rsvn.rateTypeCode) validation.rateTypeCodeCheck(rsvn.rateTypeCode);
      });

      next();
   } catch (err) {
      next(err);
   }
};
