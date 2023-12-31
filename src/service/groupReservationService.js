import moment from 'moment';
import db from '../models/index.js';
import * as groupRsvnDAO from '../data-access/groupReservationDAO.js';
import { createId } from '../source/js/function/commonFn.js';
import { getRsvnDailyRates } from '../data-access/reservationDAO.js';

export const createGroupRsvnService = async (bodyData, staffId) => {
   try {
      const {
         arrivalDate,
         departureDate,
         groupName,
         leaderName,
         leaderTel,
         reference,
         companyName,
         companyTel,
         companyAddress,
         caller,
         callerTel,
      } = bodyData;

      let groupRsvnId = await createId('GroupReservation');
      const createData = {
         groupRsvnId: 'G' + groupRsvnId,
         statusCode: 'RR',
         arrivalDate: arrivalDate,
         departureDate: departureDate,
         groupName: groupName,
         leaderName: leaderName,
         leaderTel: leaderTel,
         reference: reference,
         companyName: companyName,
         companyTel: companyTel,
         companyAddress: companyAddress,
         createStaffId: staffId,
         callerName: caller,
         callerTel: callerTel,
      };

      return await groupRsvnDAO.createGroupRsvnDAO(createData);
   } catch (err) {
      throw err;
   }
};

export const createDetailRsvnsService = async (bodyData, staffId) => {
   const transaction = await db.sequelize.transaction();
   try {
      const { groupRsvnId, detailRsvnsData } = bodyData;
      const groupRsvn = await groupRsvnDAO.getGroupRsvnByIdDAO(groupRsvnId);

      let rsvnId = await createId('reservation');
      const rsvnsData = [];
      const dailyRatesData = [];
      const foliosData = [];

      for (let i = 0; i < detailRsvnsData.rooms; i++) {
         rsvnsData.push({
            rsvnId: 'R' + rsvnId,
            statusCode: 'RR',
            guestName: groupRsvn.groupName,
            arrivalDate: +detailRsvnsData.arrivalDate,
            departureDate: +detailRsvnsData.departureDate,
            roomTypeCode: detailRsvnsData.roomTypeCode,
            rateTypeCode: 'OWN',
            numberOfGuests: detailRsvnsData.numberOfGuests,
            groupRsvnId: groupRsvn.groupRsvnId,
            ...(groupRsvn.reference && { reference: groupRsvn.reference }),
            createStaffId: staffId,
            folioId: 'F' + rsvnId,
            reservatorName: groupRsvn.caller,
            reservatorTel: groupRsvn.callerTel,
         });

         foliosData.push({
            folioId: 'F' + rsvnId,
            rsvnId: 'R' + rsvnId,
         });

         detailRsvnsData.dailyRatesData.forEach((data, j) => {
            let number = String(j + 1).padStart(3, '0');
            const dailyRatesDataPerRsvn = {
               ...data,
               dailyRateId: 'R' + rsvnId + number,
               rsvnId: 'R' + rsvnId,
            };
            dailyRatesData.push(dailyRatesDataPerRsvn);
         });

         rsvnId += 1;
      }

      const response = await groupRsvnDAO.createGroupDetailRsvnsDAO(
         rsvnsData,
         transaction
      );

      await groupRsvnDAO.createGroupDetailRsvnsDailyRatesDataDAO(
         dailyRatesData,
         transaction
      );

      await groupRsvnDAO.createGroupDetailRsvnsFolioDAO(
         foliosData,
         transaction
      );

      await transaction.commit();

      if (response.length > 1) {
      }

      for await (const rsvn of response) {
         const dailyRatesData = await getRsvnDailyRates(rsvn.rsvnId);
         rsvn.dataValues.DailyRates = dailyRatesData;
      }

      return response;
   } catch (err) {
      await transaction.rollback();
      throw err;
   }
};

export const getSelectedGroupRsvnService = async (queryData) => {
   try {
      const { id } = queryData;
      return await groupRsvnDAO.getSelectedGroupRsvnDAO(id);
   } catch (err) {
      throw err;
   }
};

export const getGroupRsvnsInFilterOptionsService = async (queryData) => {
   try {
      const { createStartDate, createEndDate } = queryData;

      if (createStartDate !== undefined && createEndDate !== undefined) {
         queryData.createStartDate = new Date(
            moment(+createStartDate, 'YYYYMMDD')
               .startOf('day')
               .tz('Asia/Seoul')
               .format('YYYY-MM-DD HH:mm:ss')
         );

         queryData.createEndDate = new Date(
            moment(+createEndDate, 'YYYYMMDD')
               .endOf('day')
               .tz('Asia/Seoul')
               .format('YYYY-MM-DD HH:mm:ss')
         );
      }

      return await groupRsvnDAO.getGroupRsvnsInFilterOptionsDAO(queryData);
   } catch (err) {
      throw err;
   }
};

export const editGroupRsvnService = async (bodyData, staffId) => {
   const transaction = await db.sequelize.transaction();
   try {
      const {
         groupRsvnId,
         newStatus,
         newArrivalDate,
         newDepartureDate,
         newGroupRsvnName,
         newLeaderName,
         newLeaderTel,
         newReference,
         newCompanyName,
         newCompanyTel,
         newCompanyAddress,
         newGroupId,
         detailRsvns,
      } = bodyData;

      const groupRsvnUpdateData = {
         status: newStatus,
         arrivalDate: newArrivalDate,
         departureDate: newDepartureDate,
         groupRsvnName: newGroupRsvnName,
         leaderName: newLeaderName,
         leaderTel: newLeaderTel,
         reference: newReference,
         companyName: newCompanyName,
         companyTel: newCompanyTel,
         companyAddress: newCompanyAddress,
         groupId: newGroupId,
      };

      await groupRsvnDAO.editGroupRsvnDAO(
         groupRsvnId,
         groupRsvnUpdateData,
         staffId,
         transaction
      );

      for await (let rsvn of detailRsvns) {
         const detailRsvnUpdateData = {
            status: rsvn.status,
            arrivalDate: rsvn.arrivalDate,
            departureDate: rsvn.departureDate,
            numberOfGuests: rsvn.numberOfGuests,
            guestName: rsvn.guestName,
            roomTypeCode: rsvn.roomTypeCode,
            rateTypeCode: rsvn.rateTypeCode,
         };
         await groupRsvnDAO.editGroupDetailRsvnDAO(
            detailRsvnUpdateData,
            rsvn.rsvnId,
            staffId,
            transaction
         );
      }

      await transaction.commit();
   } catch (err) {
      await transaction.rollback();
      throw err;
   }
};

export const deleteDetailRsvnsService = async (queryData) => {
   const transaction = await db.sequelize.transaction();
   try {
      const { rsvnIds } = queryData;
      const response = await groupRsvnDAO.deleteDetailRsvnsDAO(
         rsvnIds,
         transaction
      );
      await transaction.commit();
      return response;
   } catch (err) {
      await transaction.rollback();
      throw err;
   }
};
