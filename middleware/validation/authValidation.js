import * as validation from '../../source/js/function/validation/commonValidationFn.js';
import * as authValidation from '../../source/js/function/validation/authValidationFn.js';
import { currentDateFormat } from '../../source/js/function/commonFn.js';

export const createStaffValidation = (req, res, next) => {
   try {
      let {
         name,
         gender,
         tel,
         birth,
         deptCode,
         adminYN,
         enrollDate,
         leaveDate,
      } = req.body;
      validation.nameCheck(name);
      validation.genderCheck(gender);
      validation.telCheck(tel);
      validation.birthCheck(birth);
      enrollDate
         ? authValidation.enrollDateCheck(enrollDate)
         : (req.body.enrollDate = currentDateFormat(8));
      if (adminYN) validation.yesOrNoCheck(adminYN, '관리자여부');
      if (!deptCode) req.body.deptCode = 'NO';
      if (leaveDate) throw createError(400, '퇴사일 입력불가');
      next();
   } catch (err) {
      next(err);
   }
};

export const getAllStaffsValidation = (req, res, next) => {
   try {
      const { page, itemsInOnePage, startDate, endDate, deptCodes } = req.body;
      page ? validation.numberCheck(page, '페이지') : (page = 1);
      itemsInOnePage
         ? validation.itemInOnePageCheck(itemsInOnePage)
         : (itemsInOnePage = 50);

      Array.isArray(deptCodes)
         ? deptCodes.forEach((code) => {
              validation.deptCodeCheck(code);
           })
         : () => {
              throw createError(400, '부서 입력오류(배열이 아님)');
           };

      if (startDate) dateCheck(startDate);
      if (endDate) dateCheck(endDate);
      if (+startDate > +endDate)
         throw createError(400, '검색 시작일이 검색 종료일보다 늦을 수 없음');
      next();
   } catch (err) {
      next(err);
   }
};

export const getStaffsInOptionsValidation = (req, res, next) => {
   try {
      const { page, itemsInOnePage, startDate, endDate, deptCodes, leaveYN } =
         req.body;
      page ? validation.numberCheck(page, '페이지') : (page = 1);
      itemsInOnePage
         ? validation.itemInOnePageCheck(itemsInOnePage)
         : (itemsInOnePage = 50);

      Array.isArray(deptCodes)
         ? deptCodes.forEach((code) => {
              validation.deptCodeCheck(code);
           })
         : () => {
              throw createError(400, '부서코드 입력오류(배열이 아님)');
           };
      if (leaveYN) validation.yesOrNoCheck(leaveYN, '퇴사여부');
      if (startDate) validation.dateCheck(startDate);
      if (endDate) validation.dateCheck(endDate);
      if (+startDate > +endDate)
         throw createError(400, '검색 시작일이 검색 종료일보다 늦을 수 없음');
      next();
   } catch (err) {
      next(err);
   }
};

export const editStaffValidation = (req, res, next) => {
   try {
      const {
         staffId,
         newName,
         newGender,
         newTel,
         newBirth,
         adminYN,
         newLeaveDate,
         newEnrollDate,
         newDeptCode,
      } = req.body;

      authValidation.staffIdCheck(staffId);
      if (newName) validation.nameCheck(newName);
      if (newGender) validation.genderCheck(newGender);
      if (newTel) validation.telCheck(newTel);
      if (newBirth) validation.birthCheck(newBirth);
      if (newDeptCode) validation.deptCodeCheck(newDeptCode);
      if (adminYN) validation.yesOrNoCheck(adminYN, '관리자여부');
      if (newEnrollDate || (newEnrollDate && newLeaveDate)) {
         authValidation.enrollDateCheck(newEnrollDate);
         authValidation.leaveDateCheck(newLeaveDate, newEnrollDate);
      }
      next();
   } catch (err) {
      next(err);
   }
};

export const staffIdOnlyValidation = (req, res, next) => {
   try {
      const { staffId } = req.body;
      authValidation.staffIdCheck(staffId);
      next();
   } catch (err) {
      next(err);
   }
};

export const editPasswordValidation = (req, res, next) => {
   try {
      const { staffId, password, newPassword } = req.body;
      authValidation.staffIdCheck(staffId);

      if (password === newPassword)
         throw createError(400, '비밀번호/변경비밀번호 동일');
      validation.passwordCheck(password);
      validation.passwordCheck(newPassword);
      next();
   } catch (err) {
      next(err);
   }
};

export const loginValidation = (req, res, next) => {
   try {
      const { staffId, password } = req.body;
      authValidation.staffIdCheck(staffId);
      validation.passwordCheck(password);
      next();
   } catch (err) {
      next(err);
   }
};
