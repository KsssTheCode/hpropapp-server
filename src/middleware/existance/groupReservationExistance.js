import * as existance from '../../source/js/function/existance/existanceFn.js';

export const createDetailRsvnsExistance = async (req, res, next) => {
   try {
      const { groupRsvnId, detailRsvnsData } = req.body;

      const isExistingGroupRsvn = existance.checkExistingGroupRsvn(groupRsvnId);
      if (!isExistingGroupRsvn)
         throw createError(404, '존재하지 않는 단체예약');

      Array.isArray(detailRsvnsData)
         ? async () => {
              for await (let rsvn of detailRsvnsData) {
                 const isExistingRoomType =
                    await existance.checkExistingRoomType(rsvn.roomTypeCode);
                 if (!isExistingRoomType)
                    throw createError(404, '존재하지 않는 객실타입');

                 existance.checkNumberOfGuestsInRange(
                    isExistingRoomType,
                    rsvn.numberOfGuests
                 );

                 const isExistingRateType =
                    await existance.checkExistingRateType(rsvn.rateTypeCode);
                 if (!isExistingRateType)
                    throw createError(404, '존재하지 않는 요금책정형식');
              }
           }
         : () => {
              throw createError(422, '세부예약건 입력오류(Not an array)');
           };
      next();
   } catch (err) {
      next(err);
   }
};

export const getGroupRsvnsInFilterOptionsExistance = async (req, res, next) => {
   try {
      const { status } = req.query;

      if (status) {
         status.split(',').forEach((code) => {
            existance.checkExistingRsvnStatus(code);
         });
      }
      next();
   } catch (err) {
      next(err);
   }
};

export const editGroupRsvnExistance = async (req, res, next) => {
   try {
      const { newStatus, groupRsvnId } = req.body;
      await existance.checkExistingRsvn('GroupReservation', groupRsvnId);
      if (newStatus)
         await existance.checkAvailableRsvnStatus(
            'groupReservation',
            groupRsvnId,
            newStatus
         );

      // if (detailRsvns)
      //    for await (let rsvn of detailRsvns) {
      //       const isExistingRsvn = await existance.checkExistingRsvn(
      //          'Reservation',
      //          rsvn.rsvnId
      //       );
      //       if (!isExistingRsvn)
      //          throw createError(400, '존재하지 않는 개별예약');

      //       await existance.checkAvailableRsvnStatus(
      //          'Reservation',
      //          rsvn.rsvnId,
      //          rsvn.status
      //       );

      //       const isExistingRoomType = await existance.checkExistingRoomType(
      //          rsvn.roomTypeCode
      //       );
      //       if (!isExistingRoomType)
      //          throw createError(400, '존재하지 않는 객실타입');

      //       const isExsitingRateType = await existance.checkExistingRateType(
      //          rsvn.rateTypeCode
      //       );
      //       if (!isExsitingRateType)
      //          throw createError(400, '존재하지 않는 요금책정형식');
      //    }
      next();
   } catch (err) {
      next(err);
   }
};

export const checkGroupRsvnExistanceOnly = async (req, res, next) => {
   try {
      let groupRsvnIds;
      if (Object.keys(req.body).length > 0) ({ groupRsvnIds } = req.body);
      if (Object.keys(req.query).length > 0) {
         ({ groupRsvnIds } = req.query);
         groupRsvnIds = groupRsvnIds.split(',');
      }

      for await (let id of groupRsvnIds) {
         const isExistingGroupRsvn = await existance.checkExistingRsvn(id);
         if (!isExistingGroupRsvn)
            throw createError(404, '존재하지 않는 단체예약');
      }

      next();
   } catch (err) {
      next(err);
   }
};
