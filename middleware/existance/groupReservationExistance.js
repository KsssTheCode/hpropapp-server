import * as existance from '../../source/js/function/existance/existanceFn.js';

export const createGroupRsvnWithDetailRsvnsExistance = async (
   req,
   res,
   next
) => {
   try {
      const { groupId } = req.body;
      // if (groupId) {
      //    const isExistingGroup = await existance.checkExistingGroup(groupId);
      //    if (!isExistingGroup) throw createError(400, '존재하지 않는 단체');
      // }
      next();
   } catch (err) {
      next(err);
   }
};

export const createDetailRsvnsOfGroupRsvn = async (req, res, next) => {
   try {
      const { groupRsvnId, detailRsvns } = req.body;

      const isExistingGroupRsvn = existance.checkExistingGroupRsvn(groupRsvnId);
      if (!isExistingGroupRsvn)
         throw createError(400, '존재하지 않는 단체예약');

      for await (let rsvn of detailRsvns) {
         const isExistingRoomType = await existance.checkExistingRoomType(
            rsvn.roomTypeCode
         );
         if (!isExistingRoomType)
            throw createError(400, '존재하지 않는 객실타입');

         existance.checkNumberOfGuestsInRange(
            isExistingRoomType,
            rsvn.numberOfGuests
         );

         const isExistingRateType = await existance.checkExistingRateType(
            rsvn.rateTypeCode
         );
         if (!isExistingRateType)
            throw createError(400, '존재하지 않는 요금책정형식');
      }
      next();
   } catch (err) {
      next(err);
   }
};

export const checkGroupRsvnExistanceAndStore = async (req, res, next) => {
   try {
      const { id } = req.query;
      const isExistingGroupRsvn = await existance.checkExistingRsvn(id);
      isExistingGroupRsvn
         ? (req.body.groupRsvnData = isExistingGroupRsvn)
         : () => {
              throw createError(400, '존재하지 않는 단체예약');
           };
      next();
   } catch (err) {
      next(err);
   }
};

export const getGroupRsvnsInOptionsExistance = async (req, res, next) => {
   try {
      const { page, itemsInOnePage, status } = req.body;
      if (page > 1) existance.checkAvailablePage(page, itemsInOnePage);

      if (status) {
         status.forEach((code) => {
            existance.checkAvailableRsvnStatus(code);
         });
      }
      next();
   } catch (err) {
      next(err);
   }
};

export const editGroupRsvnExistance = async (req, res, next) => {
   try {
      const { newStatus, groupRsvnId, detailRsvns } = req.body;
      await existance.checkExistingRsvn('GroupReservation', groupRsvnId);
      if (newStatus)
         await existance.checkAvailableRsvnStatus(
            'GroupReservation',
            groupRsvnId,
            newStatus
         );

      if (detailRsvns)
         for await (let rsvn of detailRsvns) {
            const isExistingRsvn = await existance.checkExistingRsvn(
               'Reservation',
               rsvn.rsvnId
            );
            if (!isExistingRsvn)
               throw createError(400, '존재하지 않는 개별예약');

            await existance.checkAvailableRsvnStatus(
               'Reservation',
               rsvn.rsvnId,
               rsvn.status
            );

            const isExistingRoomType = await existance.checkExistingRoomType(
               rsvn.roomTypeCode
            );
            if (!isExistingRoomType)
               throw createError(400, '존재하지 않는 객실타입');

            const isExsitingRateType = await existance.checkExistingRateType(
               rsvn.rateTypeCode
            );
            if (!isExsitingRateType)
               throw createError(400, '존재하지 않는 요금책정형식');
         }
      next();
   } catch (err) {
      next(err);
   }
};

export const checkGroupRsvnExistanceOnly = async (req, res, next) => {
   try {
      const { groupRsvnId } = req.body;
      const isExistingGroupRsvn = await existance.checkExistingRsvn(
         groupRsvnId
      );
      if (!isExistingGroupRsvn)
         throw createError(400, '존재하지 않는 단체예약');
      next();
   } catch (err) {
      next(err);
   }
};
