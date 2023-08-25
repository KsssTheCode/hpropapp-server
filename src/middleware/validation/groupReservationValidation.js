import { createError } from '../../source/js/function/commonFn.js';
import * as validation from '../../source/js/function/validation/commonValidationFn.js';

export const createGroupRsvnValidation = (req, res, next) => {
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
      } = req.body;

      validation.groupNameCheck(groupName);
      validation.rsvnDateCheck(arrivalDate, departureDate);
      if (leaderName) validation.nameCheck(leaderName);
      if (leaderTel) validation.telCheck(leaderTel);
      if (arrivalTime) validation.timeCheck(arrivalTime);
      if (departureTime) validation.timeCheck(departureTime);
      if (companyName) validation.groupNameCheck(companyName);
      if (companyTel) validation.telCheckNotForPhone(companyTel);
      if (groupId) validation.idCheck(groupId, '그룹번호');

      // const detailsData = req.body.detail.map((rsvn) => {
      //    return { detailArr: rsvn.arrivalDate, detailDep: rsvn.departureDate };
      // });
      // validation.rsvnDateCheck(detailsData.detailArr, detailsData.detailDep);
      // validation.rsvnDateCheck(arrivalDate, departureDate);
      // if (
      //    arrivalDate < detailsData.detailArr ||
      //    departureDate < detailsData.detailDep
      // ) {
      //    throw createError(
      //       400,
      //       '세부 예약건은 마스터 예약건의 기간 내에 존재해야 합니다.'
      //    );
      // }
      next();
   } catch (err) {
      next(err);
   }
};

export const createDetailRsvnsValidation = (req, res, next) => {
   try {
      const { groupRsvnId, detailRsvnsData } = req.body;
      validation.idCheck(groupRsvnId);

      Array.isArray(detailRsvnsData)
         ? detailRsvnsData.forEach((rsvn) => {
              validation.rsvnDateCheck(rsvn.arrivalDate, rsvn.departureDate);
              guestName
                 ? validation.nameCheck(rsvn.guestName)
                 : (rsvn.guestName = groupName);
              if (rsvn.numberOfGuests) validation.numberCheck(numberOfGuests);
              validation.roomTypeCodeCheck(rsvn.roomTypeCode);
              validation.rateTypeCodeCheck(rsvn.rateTypeCode);
           })
         : () => {
              throw createError(422, '세부예약건 입력오류(Not an array)');
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

export const getGroupRsvnsInFilterOptionsValidation = (req, res, next) => {
   try {
      const {
         status,
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

      if (arrivalStartDate || arrivalEndDate) {
         const { adjustedStartDate, adjustedEndDate } =
            validation.dateSearchOptionsCheck(arrivalStartDate, arrivalEndDate);
         req.query.arrivalStartDate = adjustedStartDate;
         req.query.arrivalEndDate = adjustedEndDate;
      }

      if (departureStartDate || departureEndDate) {
         const { adjustedStartDate, adjustedEndDate } =
            validation.dateSearchOptionsCheck(
               departureStartDate,
               departureEndDate
            );
         req.query.arrivalStartDate = adjustedStartDate;
         req.query.arrivalEndDate = adjustedEndDate;
      }

      if (createStartDate || createEndDate) {
         const { adjustedStartDate, adjustedEndDate } =
            validation.dateSearchOptionsCheck(createStartDate, createEndDate);
         req.query.createStartDate = adjustedStartDate;
         req.query.createEndDate = adjustedEndDate;
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
      } = req.body;
      if (status) validation.statusCheck(status);

      //arrivalDate와 departureDate는 어느 하나라도 바뀐다면 모든 둘 다 매개변수로써 받아와야함
      validation.dateCheck(arrivalDate);
      validation.dateCheck(departureDate);
      validation.rsvnDateCheck(arrivalDate, departureDate);

      if (leaderName) validation.nameCheck(leaderName);
      if (leaderTel) validation.telCheck(leaderTel);
      if (companyName) validation.groupNameCheck(companyName);
      if (companyTel) validation.telCheck(companyTel);

      // detailRsvns.forEach((rsvn) => {
      //    if (rsvn.status) validation.statusCheck(rsvn.status);
      //    switch (true) {
      //       case rsvn.arrivalDate && !rsvn.departureDate:
      //          validation.dateCheck(rsvn.arrivalDate);
      //          break;
      //       case !rsvn.arrivalDate && rsvn.departureDate:
      //          validation.dateCheck(rsvn.departureDate);
      //          break;
      //       case rsvn.arrivalDate && rsvn.departureDate:
      //          validation.rsvnDateCheck(rsvn.arrivalDate, rsvn.departureDate);
      //    }
      //    if (rsvn.guestName) validation.groupNameCheck(rsvn.guestName);
      //    if (rsvn.roomTypeCode) validation.roomTypeCodeCheck(rsvn.roomTypeCode);
      //    if (rsvn.rateTypeCode) validation.rateTypeCodeCheck(rsvn.rateTypeCode);
      // });
      next();
   } catch (err) {
      next(err);
   }
};
