import * as validation from '../../source/js/function/validation/commonValidationFn.js';
import * as staffValidation from '../../source/js/function/validation/staffValidationFn.js';
import moment from 'moment';

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
         ? staffValidation.enrollDateCheck(enrollDate)
         : (req.body.enrollDate = moment().format('YYYYMMDD'));
      if (adminYN) validation.yesOrNoCheck(adminYN, '관리자여부');
      if (!deptCode) req.body.deptCode = 'NO';
      if (leaveDate) throw createError(400, '퇴사일 입력불가');
      next();
   } catch (err) {
      next(err);
   }
};

export const getStaffsInFilterOptionsValidation = (req, res, next) => {
   try {
      const { startDate, endDate, deptCodes, leaveYN } = req.body;

      if (deptCodes) {
         deptCodes.split(',').forEach((code) => {
            validation.deptCodeCheck(code);
         });
      }
      if (leaveYN) validation.yesOrNoCheck(leaveYN, '퇴사여부');

      if (startDate || endDate) {
         const { adjustedStartDate, adjustedEndDate } =
            validation.dateSearchOptionsCheck(startDate, endDate);
         req.query.startDate = adjustedStartDate;
         req.query.endDate = adjustedEndDate;
      }
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

      staffValidation.staffIdCheck(staffId);
      if (newName) validation.nameCheck(newName);
      if (newGender) validation.genderCheck(newGender);
      if (newTel) validation.telCheck(newTel);
      if (newBirth) validation.birthCheck(newBirth);
      if (newDeptCode) validation.deptCodeCheck(newDeptCode);
      if (adminYN) validation.yesOrNoCheck(adminYN, '관리자여부');
      if (newEnrollDate || (newEnrollDate && newLeaveDate)) {
         staffValidation.enrollDateCheck(newEnrollDate);
         staffValidation.leaveDateCheck(newLeaveDate, newEnrollDate);
      }
      next();
   } catch (err) {
      next(err);
   }
};

export const staffIdOnlyValidation = (req, res, next) => {
   try {
      const { staffId } = req.body;
      staffValidation.staffIdCheck(staffId);
      next();
   } catch (err) {
      next(err);
   }
};

export const editPasswordValidation = (req, res, next) => {
   try {
      const { staffId, password, newPassword } = req.body;
      staffValidation.staffIdCheck(staffId);

      if (password === newPassword)
         throw createError(400, '비밀번호/변경비밀번호 동일');
      validation.passwordCheck(password);
      validation.passwordCheck(newPassword);
      next();
   } catch (err) {
      next(err);
   }
};
