import moment from 'moment';
import db from '../../../models/index.js';

export function createError(status, message) {
   const err = new Error();
   err.status = status;
   err.message = message;
   return err;
}

export function currentDateFormat(length) {
   const year = new Date().getFullYear().toString().substring(2);
   let month = (new Date().getMonth() + 1).toString();
   month = month.length === 1 ? '0' + month : month;
   let date = new Date().getDate().toString();
   date = date.length === 1 ? '0' + date : date;

   if (length === 8) {
      return new Date().getFullYear().toString() + month + date;
   } else if (length === 6) {
      return year + month + date;
   }
}

export const getChangeHistoryMessage = async (
   originalObject,
   updatedObject
) => {
   const expectProperties = ['updatedAt', 'createdAt', 'historyChange'];
   const changedProperties = [...updatedObject._changed].filter(
      (prop) => !expectProperties.includes(prop)
   );

   let historyMessage = '';
   changedProperties.forEach((prop) => {
      if (!historyMessage) {
         historyMessage = `${prop} : ${originalObject[prop]} >> ${updatedObject[prop]}`;
         console.log(historyMessage);
      } else {
         historyMessage += `/ ${prop} : ${originalObject[prop]} >> ${updatedObject[prop]}`;
      }
   });

   //로그인 및 세션 기능 완성 시, 현재 로그인된 직원의 rsvnId
   // const staffName = await db.Staff.findByPk(staffId, {
   //    attributes: ['name'],
   // }).catch(() => {
   //    throw createError(500, '변경기록 생성 직원 조회 중 DB에서 오류발생');
   // });
   return {
      historyMessage,
      editor: '230425001',
      updateTime: moment().format('YYY-MM-DD HH:mm:ss'),
   };
};

// export function getChangeHistoryMessage1(
//    beforeChange, //변경 천 객체
//    changePropertiesRequested, //변경 후 객체
//    exceptProperties //변경메세지에 반영하지 않을 변수
// ) {
//    //changePropertiesOnly에 [ [key1, value1], [key2,value2], ..형태로 담음
//    const changePropertiesOnly = Object.entries(changePropertiesRequested)
//       //변경메세지에서 제외시킬 변수를 소거
//       .filter(
//          ([key]) =>
//             !exceptProperties.includes(key) ||
//             !['updatedAt', 'deletedAt', 'createdAt', 'historyChange'].includes(
//                key
//             )
//       )
//       //원본 객체에서 변수명이 동일한 변수 중 값이 다른 것만 소거
//       .filter(([key, value]) => beforeChange[key] !== value)
//       //flatMap으로 내부의 key,value배열을 전달한 콜백함수를 실행하여 결과를 새로운 배열로 반환
//       .flatMap(([key, value]) =>
//          //value값이 배열일 시, 배열 내 객체를 [objKey, objValue]형식으로 나열하여 메세지 생성
//          //아닐 시, 메세지 생성
//          Array.isArray(value)
//             ? value.map((obj) =>
//                  Object.entries(obj)
//                     .map(
//                        ([objKey, objValue]) =>
//                           `${key}.${objKey}: ${beforeChange[key][objKey]} >> ${objValue}`
//                     )
//                     .join('/ ')
//               )
//             : `${key}: ${beforeChange[key]} >> ${value}`
//       );

//    //한 줄의 메세지로 변환
//    const historyMessage = changePropertiesOnly.join('/ ');

//    return {
//       historyMessage,
//       editor: '230425001',
//       updateTime: new Date().getTime(),
//    };
// }

export const createId = async (modelName) => {
   let model = null;
   let primaryKey = null;
   switch (modelName.toLowerCase()) {
      case 'reservation':
         model = db.Reservation;
         primaryKey = 'rsvnId';
         break;
      case 'groupreservation':
         model = db.GroupReservation;
         primaryKey = 'groupRsvnId';
         break;
      case 'member':
         model = db.Member;
         primaryKey = 'memberId';
         break;
      case 'group':
         model = db.Group;
         primaryKey = 'groupId';
         break;
      case 'memo':
         model = db.Memo;
         primaryKey = 'memoId';
         break;
      case 'membership':
         model = db.Membership;
         primaryKey = 'membershipGrade';
         break;
      case 'staff':
         model = db.Staff;
         primaryKey = 'staffId';
         break;
   }

   let id = Number(currentDateFormat(6) + '001');
   let latestId = await model.max(primaryKey).catch(() => {
      throw createError(500, '예약번호 최대값 조회 중 DB에서 오류발생');
   });
   if (latestId) {
      latestId = latestId.slice(-9);
      if (+latestId >= id) id = +latestId + 1;
   }

   return id;
};

//전달받은 날짜들 사이에 존재하는 날짜를 배열에 담기
export const getDatesBetweenTerm = (startDate, endDate) => {
   const dateArray = [];
   let currentDate = moment(startDate);

   while (currentDate <= moment(endDate)) {
      dateArray.push(currentDate.format('YYYYMMDD'));
      currentDate = currentDate.add(1, 'day');
   }

   return dateArray;
};

export const countRecords = async (recordName) => {
   switch (recordName.toLowerCase()) {
      case 'reservation':
         model = db.Reservation;
         break;
      case 'groupreservation':
         model = db.GroupReservation;
         break;
      case 'member':
         model = db.Member;
         break;
      case 'group':
         model = db.Group;
         break;
      case 'memo':
         model = db.Memo;
         break;
   }

   return await db.model.count();
};

export const getOffset = (page, itemsInOnePage) => {
   let offset;
   +page === 1 ? (offset = 0) : (offset = itemsInOnePage * (page - 1) - 1);
   return offset;
};

// export const remainOnlyChangedProperties = (
//    beforeChange,
//    changePropertiesRequested
// ) => {
//    afterChange.forEach((item) => {
//       const editItems = [];

//       for (let key in changePropertiesRequested) {
//          editItems.push([key, changePropertiesRequested[key]]);
//       }

//       if (
//          beforeChange[editItems[0]] !== changePropertiesRequested[editItems[0]]
//       )
//          delete changePropertiesRequested[editItems[0]];
//    });

//    return afterChange;
// };
