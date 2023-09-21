import { getRoomRatesInOptions } from '../controllers/roomRateController.js';
import * as rsvnDAO from '../data-access/reservationDAO.js';
import { getRoomsDataByRoomNumberDAO } from '../data-access/roomDAO.js';
import { getRoomRatesInOptionsDAO } from '../data-access/roomRateDAO.js';
import db from '../models/index.js';
import { createId } from '../source/js/function/commonFn.js';

export const getSelectedRsvnService = async (id) => {
   try {
      const rsvnData = await rsvnDAO.getSelectedRsvnDAO(id);

      const { arrivalDate, departureDate, roomTypeCode, rateTypeCode } =
         rsvnData;

      const roomRatesSearchOptions = {
         startDate: arrivalDate,
         endDate: departureDate,
         roomTypeCode: [roomTypeCode],
         rateTypeCode: [rateTypeCode],
      };

      const roomRatesData = await getRoomRatesInOptionsDAO(
         roomRatesSearchOptions
      );

      const response = { rsvn: rsvnData, roomRatesData };

      return response;
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

      await rsvnDAO.createRsvnDAO(newRsvnObject, dailyRatesData, transaction);

      await transaction.commit();

      const response = await rsvnDAO.getSelectedRsvnDAO('R' + rsvnId);

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

      if (!queryData.statusCodes) queryData.statusCodes = 'RR,CI,HC,CO';

      return await rsvnDAO.getRsvnsInFilterOptionsDAO(queryData);
   } catch (err) {
      throw err;
   }
};

export const editRsvnService = async (bodyData, staffId) => {
   const transaction = await db.sequelize.transaction();
   try {
      const {
         statusCode,
         arrivalDate,
         roomNumber,
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
         dailyRatesData,
         rsvnId,
      } = bodyData;

      const updateData = {
         ...(statusCode && { statusCode }),
         ...(arrivalDate && { arrivalDate }),
         ...(roomNumber && { roomNumber }),
         ...(departureDate && { departureDate }),
         ...(numberOfGuests && { numberOfGuests }),
         ...(guestName && { guestName }),
         ...(tel1 && { tel1 }),
         ...(tel2 && { tel2 }),
         ...(caller && { caller }),
         ...(callerTel && { callerTel }),
         ...(arrivalTime && { arrivalTime }),
         ...(departureTime && { departureTime }),
         ...(reference && { reference }),
         ...(roomTypeCode && { roomTypeCode }),
         ...(rateTypeCode && { rateTypeCode }),
      };

      const response = await rsvnDAO.editRsvnDAO(
         rsvnId,
         updateData,
         staffId,
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

export const assignRoomToRsvnService = async (bodyData, staffId) => {
   const transaction = await db.sequelize.transaction();
   try {
      const { id, roomNumber } = bodyData.idAndRoomPairs[0];
      const updatedRsvnData = await rsvnDAO.assignRoomToRsvnDAO(
         id,
         roomNumber,
         staffId,
         transaction
      );
      await transaction.commit();

      return { updatedRsvnData, roomData: roomNumber };
   } catch (err) {
      await transaction.rollback();
      throw err;
   }
};

export const releaseAssignedRoomFromRsvnService = async (bodyData, staffId) => {
   const transaction = await db.sequelize.transaction();
   try {
      const rsvnId = bodyData.id[0];

      const updatedRsvnData = await rsvnDAO.releaseAssignedRoomFromRsvnDAO(
         rsvnId,
         staffId,
         transaction
      );

      const releasedRoomData = await getRoomsDataByRoomNumberDAO([
         updatedRsvnData.previous().roomNumber,
      ]);

      await transaction.commit();

      return { updatedRsvnData, roomData: releasedRoomData };
   } catch (err) {
      await transaction.rollback();
      throw err;
   }
};
