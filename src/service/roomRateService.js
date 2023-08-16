import moment from 'moment';

import * as roomRateDAO from '../data-access/roomRateDAO.js';
import { getDatesBetweenTerm } from '../source/js/function/commonFn.js';
import db from '../models/index.js';

export const initializeRoomRatesInTermService = async (bodyData) => {
   try {
      const { startDate, endDate, roomTypeCode, rateTypeCode } = bodyData;

      //startDate, endDate : "YYYYMMDD"형식의 문자열
      //roomTypeCode, rateTypeCdoe : 배열 (선택값 없을 시, 전체로 선택)
      const term = getDatesBetweenTerm(startDate, endDate);

      const roomRatesArr = [];
      term.forEach((date) => {
         roomTypeCode.forEach((roomTypeCode) => {
            rateTypeCode.forEach((rateTypeCode) => {
               roomRatesArr.push({
                  date,
                  roomTypeCode,
                  rateTypeCode,
                  price: 0,
               });
            });
         });
      });

      return await roomRateDAO.initializeRoomRatesInTermDAO(roomRatesArr);
   } catch (err) {
      throw err;
   }
};

export const getAllRoomRatesOfCurrentMonthService = async () => {
   try {
      const startOfMonth = moment().startOf('month').format('YYYYMMDD');
      const endOfMonth = moment().endOf('month').format('YYYYMMDD');
      return await roomRateDAO.getAllRoomRatesOfCurrentMonthDAO(
         startOfMonth,
         endOfMonth
      );
   } catch (err) {
      throw err;
   }
};

export const getRoomRatesInOptionsService = async (bodyData) => {
   try {
      //startDate, endDate : "YYYYMMDD"형식의 문자열
      //roomTypeCode, rateTypeCdoe : 배열 (선택값 없을 시, 전체로 선택)
      const { startDate, endDate, rateTypeCode, roomTypeCode } = bodyData;

      return await roomRateDAO.getRoomRatesInOptionsDAO(
         startDate,
         endDate,
         roomTypeCode,
         rateTypeCode
      );
   } catch (err) {
      throw err;
   }
};

export const getSelectedRoomRateService = async (bodyData) => {
   try {
      const { roomRateId } = bodyData;
      return await roomRateDAO.getSelectedRoomRateDAO(roomRateId);
   } catch (err) {
      throw err;
   }
};
export const getRoomRateByIndexesService = async (queryData) => {
   try {
      const { roomTypeCode, rateTypeCode, startDate, endDate } = queryData;

      let term = getDatesBetweenTerm(startDate, endDate);

      return await roomRateDAO.getRoomRateByIndexesDAO(
         roomTypeCode,
         rateTypeCode,
         term
      );
   } catch (err) {
      throw err;
   }
};
export const editRoomRatesInOptionsService = async (bodyData) => {
   const transaction = await db.sequelize.transaction();
   try {
      const { startDate, endDate, roomTypeCodes, rateTypeCodes, newPrice } =
         bodyData;

      const term = getDatesBetweenTerm(startDate, endDate);

      await roomRateDAO.updateRoomRatesInOptionsDAO(
         term,
         roomTypeCodes,
         rateTypeCodes,
         newPrice,
         transaction
      );

      await roomRateDAO.createRoomRatesInOptionsDAO(
         term,
         roomTypeCodes,
         rateTypeCodes,
         newPrice,
         transaction
      );

      await transaction.commit();
   } catch (err) {
      await transaction.rollback();
      throw err;
   }
};

/**
 * Edit sprcific room rate by following process.
 * 1.Get specific room rate datas by using index combination(date, rate type, room type). (Sort found combination and unfound combination separately)
 * 2.Update found room rate get from precess 1
 * 3.Create unfound room rate get from process 1
 * @returns
 */
export const editSpecificRoomRatesService = async (bodyData) => {
   const transaction = await db.sequelize.transaction();
   try {
      const { editObjects } = bodyData;

      const isExistingRoomRates = [];
      const notExistingRoomRates = [];
      for await (let obj of editObjects) {
         const foundRoomRate = await roomRateDAO.getSpecificRoomRateDAO(
            obj.date,
            obj.rateTypeCode,
            obj.roomTypeCode
         );

         foundRoomRate
            ? isExistingRoomRates.push(obj)
            : notExistingRoomRates.push(obj);
      }

      for await (let obj of isExistingRoomRates) {
         await roomRateDAO.updateSpecificRoomRateDAO(
            obj.date,
            obj.rateTypeCode,
            obj.roomTypeCode,
            obj.newPrice,
            transaction
         );
      }

      const response = await roomRateDAO.createRoomRatesInArrayDAO(
         notExistingRoomRates,
         transaction
      );

      await transaction.commit();
      return response;
   } catch (err) {
      await transaction.rollback();
      throw err;
   }
};
