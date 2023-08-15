import db from '../models/index.js';
import * as dailyRateDAO from '../data-access/dailyRateDAO.js';
import { getDatesBetweenTerm } from '../source/js/function/commonFn.js';

export const getNewDailyRateService = async (queryData) => {
   const transaction = db.sequelize.transaction();
   try {
      const { arrivalDate, departureDate, roomTypeCode, rateTypeCode, rsvnId } =
         queryData;

      await dailyRateDAO.destoryDailyRate(rsvnId, transaction);

      const dateTerm = getDatesBetweenTerm(arrivalDate, departureDate);
      const newDailyRatesData = [];
      let number = '001';
      for await (let date of dateTerm) {
         const newDailyRate = await dailyRateDAO.getNewDailyRateDAO(
            roomTypeCode,
            rateTypeCode,
            rsvnId,
            date,
            number,
            transaction
         );

         newDailyRatesData.push(newDailyRate);
      }

      transaction.commit();
      return newDailyRatesData;
   } catch (err) {
      transaction.rollback();
      throw err;
   }
};

export const editSpecificRsvnDailyRateService = async (bodyData) => {
   const transaction = db.sequelize.transaction();
   try {
      const { newDailyRatesData } = bodyData;

      const updatedRates = [];

      for await (let data of newDailyRatesData) {
         const updatedRate = await editDailyRate(data, transaction);
         updatedRates.push(updatedRate);
      }

      transaction.commit();
      return updatedRates;
   } catch (err) {
      transaction.rollback();
      throw err;
   }
};
