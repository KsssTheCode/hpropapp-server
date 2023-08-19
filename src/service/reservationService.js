import db from '../models/index.js';
import moment from 'moment';

import * as rsvnDAO from '../data-access/reservationDAO.js';
import { createId } from '../source/js/function/commonFn.js';

export const getSelectedRsvnService = async (id) => {
   try {
      const { rsvnData, roomRatesData } = await rsvnDAO.getSelectedRsvnDAO(id);

      const convertedResponse = {
         ...rsvnData.get(),
         RoomRates: roomRatesData.map((roomRate) => roomRate.get()),
      };

      return convertedResponse;
   } catch (err) {
      throw err;
   }
};

export const createRsvnService = async (bodyData, staffId) => {
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
      } = bodyData;
      let { arrivalTime, departureTime } = bodyData;

      let rsvnId = await createId('reservation');

      const newRsvnObject = {
         rsvnId: 'R' + rsvnId,
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

      const response = await rsvnDAO.createRsvnDAO(
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

export const getRsvnsInFilterOptionsService = async (queryData) => {
   try {
      let { createStartDate, createEndDate } = queryData;

      if (createStartDate || createEndDate) {
         if (createStartDate && !createEndDate) createEndDate = createStartDate;
         if (!createStartDate && createEndDate) createStartDate = createEndDate;

         createStartDate = new Date(
            moment(+createStartDate, 'YYYYMMDD')
               .startOf('day')
               .tz('Asia/Seoul')
               .format('YYYY-MM-DD HH:mm:ss')
         );

         createEndDate = new Date(
            moment(+createEndDate, 'YYYYMMDD')
               .endOf('day')
               .tz('Asia/Seoul')
               .format('YYYY-MM-DD HH:mm:ss')
         );

         queryData.createStartDate = createStartDate;
         queryData.createEndDate = createEndDate;
      }

      return await rsvnDAO.getRsvnsInFilterOptionsDAO(queryData);
   } catch (err) {
      throw err;
   }
};

export const editRsvnService = async (bodyData, staffId) => {
   const transaction = await db.sequelize.transaction();
   try {
      const response = await rsvnDAO.editRsvnDAO(
         bodyData,
         staffId,
         transaction
      );
      await transaction.commit();
      return response;
   } catch (err) {
      await transaction.rollback();
      throw err;
   }
};

export const assignRoomToRsvnService = async (bodyData, staffId) => {
   const transaction = await db.sequelize.transaction();
   try {
      const { id, roomNumber } = bodyData.idAndRoomPairs[0];
      const response = await rsvnDAO.assignRoomToRsvnDAO(
         id,
         roomNumber,
         staffId,
         transaction
      );
      await transaction.commit();
      return response;
   } catch (err) {
      await transaction.rollback();
      throw err;
   }
};

export const releaseAssignedRoomFromRsvnService = async (bodyData, staffId) => {
   const transaction = await db.sequelize.transaction();
   try {
      const { ids } = bodyData;
      const response = await rsvnDAO.releaseAssignedRoomFromRsvnDAO(
         ids,
         staffId,
         transaction
      );
      await transaction.commit();
      return response;
   } catch (err) {
      await transaction.rollback();
      throw err;
   }
};
