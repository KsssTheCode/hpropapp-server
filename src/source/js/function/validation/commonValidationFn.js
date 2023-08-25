import moment from 'moment';
import { createError } from '../commonFn.js';

export const nameCheck = (name) => {
   const nameRegExp = /^[가-힣a-zA-Z]{2,30}$/;
   if (!nameRegExp.test(name)) throw createError(422, '이름 입력오류');
};

export const genderCheck = (gender) => {
   if (!(gender === 'M' || gender === 'F'))
      throw createError(422, '성별 입력오류');
};

export const birthCheck = (birth) => {
   const birthRegExp = /^[0-9]{8}$/;
   if (!birthRegExp.test(birth) || +birth >= moment().format('YYYYMMDD'))
      throw createError(422, '생년월일 입력오류');
};

export const passwordCheck = (password) => {
   //최소 8 자 및 최대 15 자, 하나 이상의 대문자, 하나의 소문자, 하나의 숫자 및 하나의 특수 문자
   const passwordRegExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,15}$/;
   if (!passwordRegExp.test(password))
      throw createError(422, '비밀번호 입력오류');
};

export const telCheck = (tel) => {
   const telRegExp = /^01([0|1|6|7|8|9])([1-9][0-9]{2,3})([0-9]{4})$/;
   if (!telRegExp.test(tel)) throw createError(422, '전화번호 입력오류');
};

export const telCheckNotForPhone = (tel) => {
   const telRegExp = /^(0\d{1,2})-(\d{3,4})-(\d{4})$/;
   if (!telRegExp.test(tel)) throw createError(422, '전화번호 입력오류');
};

export const numberCheck = (number, itemName) => {
   if (number < 0 || number === NaN) {
      throw createError(422, `${itemName} 입력오류`);
   }
};

export const yesOrNoCheck = (item, itemName) => {
   if (!(item === 'Y' || item === 'N')) {
      throw createError(422, `${itemName} 입력오류`);
   }
};

export const timeCheck = (time) => {
   const timeRegExp = /^[01][0-9]|2[0-3]([0-5][0-9]){4}$/;
   if (!timeRegExp.test(time)) throw createError(422, '(입퇴실)시간 입력 오류');
};

export const dateCheck = (date) => {
   const fullDateRegExp =
      /^(19[0-9][0-9]|20\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
   const shortenDateRegExp = /^(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;

   if (date.length === 8) {
      if (!fullDateRegExp.test(date)) throw createError(422, '날짜 입력오류');
   } else {
      if (!shortenDateRegExp.test(date))
         throw createError(422, '날짜 입력오류');
   }
};

export const memoTitleCheck = (title) => {
   if (title.length < 3 || title.length > 60)
      throw createError(422, '(한글,영문,숫자 무관)3자 이상, 20자 이하');
};

export const rateTypeCodeCheck = (rateTypeCode) => {
   const rateTypeRegExp = /^[A-Z]{3}$/;
   if (!rateTypeRegExp.test(rateTypeCode))
      throw createError(422, '객실타입코드 입력오류');
};

export const roomTypeCodeCheck = (roomTypeCode) => {
   const roomTypeRegExp = /^[A-Z]{3}$/;
   if (!roomTypeRegExp.test(roomTypeCode))
      throw createError(422, '객실타입코드 입력오류');
};

export const departmentCodeCheck = (deptCode) => {
   const deptCodeRegExp = /^[A-Z]{2}$/;
   if (!deptCodeRegExp.test(deptCode))
      throw createError(422, '부서코드 입력오류');
};

export const cleanStatusCodeCheck = (cleanStatusCode) => {
   const cleanStatusArr = ['D', 'C', 'I', 'NG'];
   const isExisiting = cleanStatusArr.includes(cleanStatusCode.upperCase());
   return isExisiting;
};

export const referenceCheck = (reference) => {
   if (reference.length > 150)
      throw createError(422, '(한글,영어,숫자 무관)100자 이하');
};

/**
 * [Validation] Check validation of provided id value. If validation fails, an error will be thrown.
 * @param {string} id - ID value.
 * @param {string} idName - Kind of id value which will be created as an error message.
 */
export const idCheck = (id, idName) => {
   const idRegExp = /^(?:[A-Z]\d{9}|[A-Z]{2}\d{9})$/;
   if (!idRegExp.test(id))
      throw createError(422, `잘못된 입력의 ${idName}입니다.`);
};
export const groupNameCheck = (groupName) => {
   const groupNameRegExp = /^[\dA-Za-z가-힣()]{2,30}$/;
   if (!groupNameRegExp.test(groupName))
      throw createError(422, '단체명 입력오류');
};

export const carNumberCheck = (carNumber) => {
   const carNumberRegExp = /^[0-9]{1,3}[가-힣]{1}[0-9]{1,4}|$/;
   if (!carNumberRegExp.test(carNumber)) {
      throw createError(422, '차량번호 오입력');
   }
};

export const membershipGradeCheck = (grade) => {
   if ((grade >= 'Z', grade <= 'A'))
      throw createError(422, '멤버십 등급 입력오류');
};

export const discountCheck = (discount) => {
   if (discount < 0 || discount > 100)
      throw createError(422, '할인율 입력오류');
};
export const statusCheck = (status) => {
   const statusArr = ['RR', 'CI', 'HC', 'CO', 'CX'];
   const result = statusArr.includes(status);
   if (!result) throw createError(422, '존재하지 않는 예약상태');
};

export const specialCharacterCheck = (str) => {
   const regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
   if (regex.test(str)) throw createError(422, '특수문자 입력감지');
};

export const nationalityCheck = (nationCode) => {
   const nationRegExp = /^[A-Z]{2}$/;
   if (!nationRegExp.test(nationCode)) {
      throw createError(422, '국가코드 오입력');
   }
};

export const rsvnDateCheck = (arrivalDate, departureDate) => {
   const dateRegExp =
      /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
   const currentDate = moment().format('YYYYMMDD');

   if (!dateRegExp.test(+arrivalDate)) {
      throw createError(422, '투숙시작날짜 입력 오류');
   }

   if (!dateRegExp.test(+departureDate)) {
      throw createError(422, '투숙종료날짜 입력 오류');
   }

   if (+arrivalDate < +currentDate) {
      throw createError(422, '투숙시작일이 현재날짜보다 이전일 수 없습니다.');
   }

   if (+arrivalDate > +departureDate) {
      throw createError(
         422,
         '투숙시작날짜가 투숙종료날짜보다 늦을 수 없습니다.'
      );
   }
};

export const dateSearchOptionsCheck = (startDate, endDate) => {
   if (startDate && endDate) {
      dateCheck(startDate);
      dateCheck(endDate);
      if (+startDate > +endDate)
         throw createError(422, '검색 시작일이 검색 종료일보다 늦을 수 없음');
   } else if (startDate && !endDate) {
      dateCheck(startDate);
      endDate = startDate;
   } else if (!startDate && endDate) {
      dateCheck(endDate);
      startDate = endDate;
   }

   return { adjustedStartDate: startDate, adjustedEndDate: endDate };
};
