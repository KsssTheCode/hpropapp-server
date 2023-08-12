import { getDatesBetweenTerm } from './commonFn.js';

//전달받은 매개변수(조건)들에 해당되는 객체 생성)
export const convertArrayOptionsToObjects = (
   rateType,
   roomType,
   startDate,
   endDate
) => {
   const objects = [];
   const terms = getDatesBetweenTerm(startDate, endDate);

   terms.forEach((date) => {
      let roomRateObject;
      switch (true) {
         case Array.isArray(rateType) && Array.isArray(roomType):
            rateType.forEach((rateTypeCode) => {
               roomType.forEach((roomTypeCode) => {
                  roomRateObject = {
                     rateTypeCode: rateTypeCode,
                     roomTypeCode: roomTypeCode,
                     date: date,
                  };
                  objects.push(roomRateObject);
               });
            });
            break;
         case !Array.isArray(rateType) && Array.isArray(roomType):
            roomType.forEach((roomTypeCode) => {
               roomRateObject = {
                  rateTypeCode: rateType,
                  roomTypeCode: roomTypeCode,
                  date: date,
               };
               objects.push(roomRateObject);
            });
            break;
         case Array.isArray(rateType) && !Array.isArray(roomType):
            rateType.forEach((rateTypeCode) => {
               roomRateObject = {
                  rateTypeCode: rateTypeCode,
                  roomTypeCode: roomType,
                  date: date,
               };
               objects.push(roomRateObject);
            });
            break;
         default:
            roomRateObject = {
               rateTypeCode: rateType,
               roomTypeCode: roomType,
               date: date,
            };
            objects.push(roomRateObject);
            break;
      }
   });
   return objects;
};
