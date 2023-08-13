import { createError, currentDateFormat } from '../commonFn.js';

export const staffIdCheck = (staffId) => {
   const staffIdRegExp = /^[0-9]{9}$/;
   if (!staffIdRegExp.test(staffId || !staffId)) {
      throw createError(400, '사번 오류');
   }
};

const dateRegExp =
   /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;

export const leaveDateCheck = (leaveDate, enrollDate) => {
   if (!enrollDate) throw createError(400, '입사일 미입력');
   if (!dateRegExp.test(leaveDate) || +leaveDate > currentDateFormat(8))
      throw createError(400, '퇴사일 입력오류');

   if (+leaveDate < +enrollDate)
      throw createError(400, '입사일보다 퇴사일이 이를 수 없음');
};

export const enrollDateCheck = (enrollDate) => {
   if (!dateRegExp.test(enrollDate) || +enrollDate > currentDateFormat(8)) {
      throw createError(400, '입사일 입력오류');
   }
};
