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
      } = requestBodyData;
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

export const getRsvnInOptionsService = async (queryData) => {
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
      }

      const searchOptions = {
         ...queryData,
         createStartDate,
         createEndDate,
      };

      return await rsvnDAO.getRsvnsInOptionsDAO(searchOptions);
   } catch (err) {
      throw err;
   }
};

export const editRsvnService = async (bodyData) => {
   const transaction = await db.sequelize.transaction();
   try {
      const response = await rsvnDAO.editRsvnDAO(bodyData, transaction);
      await transaction.commit();
      return response;
   } catch (err) {
      await transaction.rollback();
      throw err;
   }
};

export const assignRoomToRsvnService = async (id, roomNumber, staffId) => {
   const transaction = await db.sequelize.transaction();
   try {
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

export const releaseAssignedRoomFromRsvnService = async (id, staffId) => {
   const transaction = await db.sequelize.transaction();
   try {
      const response = await rsvnDAO.releaseAssignedRoomFromRsvnDAO(
         id,
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