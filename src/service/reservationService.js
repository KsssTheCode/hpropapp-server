import {
   createRsvnDAO,
   getSelectedRsvnDAO,
} from '../data-access/reservationDAO.js';
import db from '../models/index.js';
import { createId } from '../source/js/function/commonFn.js';

export const getSelectedRsvnService = async (id) => {
   try {
      const { rsvnData, roomRatesData } = await getSelectedRsvnDAO(id);

      const convertedResponse = {
         ...rsvnData.get(),
         RoomRates: roomRatesData.map((roomRate) => roomRate.get()),
      };

      return convertedResponse;
   } catch (err) {
      throw err;
   }
};

export const createRsvnService = async (requestBodyData, staffId) => {
   const transaction = await db.sequelize.transaction();
   try {
      const {
         arrivalDate,
         departureDate,
         numberOfGuests,
         guestName,
         tel1,
         tel2,
         caller,
         callerTel,
         reference,
         roomTypeCode,
         rateTypeCode,
         dailyRatesData,
      } = requestBodyData;
      let { arrivalTime, departureTime } = requestBodyData;

      let rsvnId = await createId('reservation');
      rsvnId = 'R' + rsvnId;
      if (arrivalTime) arrivalTime = arrivalTime.replace(':', '');
      if (departureTime) departureTime = departureTime.replace(':', '');

      const newRsvnObject = {
         rsvnId: rsvnId,
         statusCode: 'RR',
         arrivalDate,
         departureDate,
         numberOfGuests,
         guestName,
         tel1,
         tel2,
         caller,
         callerTel,
         arrivalTime,
         departureTime,
         reference,
         roomTypeCode,
         rateTypeCode,
         createStaffId: staffId,
      };

      const response = await createRsvnDAO(
         newRsvnObject,
         dailyRatesData,
         transaction
      );

      await transaction.commit();
      return response;
   } catch (err) {
      await transaction.rollback();
      throw err;
   }
};
