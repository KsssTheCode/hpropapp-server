import { createError, currentDateFormat } from '../commonFn.js';

export const rsvnDateCheck = (arrivalDate, departureDate) => {
   const dateRegExp =
      /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
   const currentDate = currentDateFormat(8);

   if (!dateRegExp.test(+arrivalDate)) {
      throw createError(400, '투숙시작날짜 입력 오류');
   }

   if (!dateRegExp.test(+departureDate)) {
      throw createError(400, '투숙종료날짜 입력 오류');
   }

   if (+arrivalDate < +currentDate) {
      throw createError(400, '투숙시작일이 현재날짜보다 이전일 수 없습니다.');
   }

   if (+arrivalDate > +departureDate) {
      throw createError(
         400,
         '투숙시작날짜가 투숙종료날짜보다 늦을 수 없습니다.'
      );
   }
};
