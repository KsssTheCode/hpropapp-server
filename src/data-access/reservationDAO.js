import { Op } from 'sequelize';
import { createError } from '../source/js/function/commonFn.js';
import db from '../models/index.js';

const Rsvn = db.Reservation;

/**
 * @param {string} id - Reservation ID.
 * @returns An object configured with Reservation data(rsvnData) and fixed room rate datas(roomRatesData).
 */
export const getSelectedRsvnDAO = async (id) => {
   try {
      const rsvnData = await Rsvn.findByPk(id, {
         include: [
            { model: db.Staff, attributes: ['name'] },
            {
               model: db.DailyRate,
               attributes: ['date', 'price'],
            },
            {
               model: db.GroupReservation,
               attributes: ['groupName', 'groupRsvnId'],
            },
            // {
            //    model: db.Member,
            //    attributes: ['memberId'],
            // },
            { model: db.ReservationChangeHistory },
         ],
      }).catch(() => {
         throw createError(500, '에약조회 중 DB에서 오류발생');
      });

      const roomRatesData = await db.RoomRate.findAll({
         attributes: ['date', 'price'],
         where: {
            date: {
               [Op.between]: [rsvnData.arrivalDate, rsvnData.departureDate],
            },
            roomTypeCode: rsvnData.roomTypeCode,
            rateTypeCode: rsvnData.rateTypeCode,
         },
      }).catch(() => {
         throw createError(500, '객실가격 중 DB에서 오류발생');
      });

      return { rsvnData, roomRatesData };
   } catch (err) {
      throw err;
   }
};

/**
 * @param {object} newRsvnObject - Reservation datas requested to be create.
 * @param {array} dailyRatesData - Amount of room per every each stay.
 * @param {Promise<Transaction>} transaction
 * @returns Data of created reservation.
 */
export const createRsvnDAO = async (
   newRsvnObject,
   dailyRatesData,
   transaction
) => {
   try {
      const response = await Rsvn.create(newRsvnObject, {
         transaction,
         dailyRatesData,
         returning: true,
      }).catch(() => {
         throw createError(500, '예약생성 중 DB에서 오류발생');
      });

      return response;
   } catch (err) {
      throw err;
   }
};

/**
 *
 * @param {object<array, object} searchOptions - Object consisting of required attributes and user-configured filter options get from widget.
 * @returns {Promise<Array<Reservation>>}Reservation datas.
 */
export const getRsvnsInFilterOptionsDAO = async (searchOptions) => {
   try {
      const {
         keyword,
         arrivalStartDate,
         arrivalEndDate,
         departureStartDate,
         departureEndDate,
         rateTypeCodes,
         roomTypeCodes,
         statusCodes,
         createStaffs,
         checkInStaffs,
         checkOutStaffs,
         createStartDate,
         createEndDate,
      } = searchOptions;
      return await Rsvn.findAll({
         where: {
            ...(keyword && {
               [Op.or]: [
                  { rsvnId: { [Op.like]: `%${keyword}%` } },
                  { guestName: { [Op.like]: `%${keyword}%` } },
                  { tel1: { [Op.like]: `%${keyword}%` } },
                  { tel2: { [Op.like]: `%${keyword}%` } },
                  { caller: { [Op.like]: `%${keyword}%` } },
                  { callerTel: { [Op.like]: `%${keyword}%` } },
                  { roomNumber: { [Op.like]: `%${keyword}%` } },
               ],
            }),
            ...(rateTypeCodes &&
               (rateTypeCodes.includes(',')
                  ? { rateTypeCode: { [Op.in]: rateTypeCodes.split(',') } }
                  : { rateTypeCode: { [Op.eq]: rateTypeCodes } })),
            ...(roomTypeCodes &&
               (roomTypeCodes.includes(',')
                  ? { roomTypeCode: { [Op.in]: roomTypeCodes.split(',') } }
                  : { roomTypeCode: { [Op.eq]: roomTypeCodes } })),
            ...(statusCodes &&
               (statusCodes.includes(',')
                  ? { statusCode: { [Op.in]: statusCodes.split(',') } }
                  : { statusCode: { [Op.eq]: statusCodes } })),
            ...(arrivalStartDate &&
               arrivalEndDate && {
                  arrivalDate: {
                     [Op.between]: [+arrivalStartDate, +arrivalEndDate],
                  },
               }),
            ...(departureStartDate &&
               departureEndDate && {
                  departureDate: {
                     [Op.between]: [+departureStartDate, +departureEndDate],
                  },
               }),
            ...(createStartDate &&
               createEndDate && {
                  createdAt: {
                     [Op.between]: [createStartDate, createEndDate],
                  },
               }),
            ...(createStaffs &&
               (createStaffs.includes(',')
                  ? { createStaffId: { [Op.in]: createStaffs.split(',') } }
                  : { createStaffId: { [Op.eq]: createStaffs } })),
         },
         include: [
            {
               model: db.GroupReservation,
               attributes: ['groupName', 'groupRsvnId'],
            },
            {
               model: db.DailyRate,
            },
         ],
         include: [
            checkInStaffs || checkOutStaffs
               ? {
                    model: db.ReservationChangeHistory,
                    where: {
                       ...(checkInStaffs && {
                          [Op.and]: [
                             {
                                'updatedProperties.statusCode': {
                                   [Op.or]: ['RR', 'CO', 'HC'],
                                },
                             },
                             {
                                'updatedReservation.statusCode': 'CI',
                             },
                             {
                                staffId: checkInStaffs.includes(',')
                                   ? {
                                        [Op.in]: checkInStaffs.split(','),
                                     }
                                   : {
                                        [Op.eq]: checkInStaffs,
                                     },
                             },
                          ],
                       }),
                       ...(checkOutStaffs && {
                          [Op.and]: [
                             {
                                'updatedProperties.statusCode': 'CI',
                             },
                             {
                                'updatedReservation.statusCode': 'CO',
                             },
                             {
                                staffId: checkOutStaffs.includes(',')
                                   ? {
                                        [Op.in]: checkOutStaffs.split(','),
                                     }
                                   : {
                                        [Op.eq]: checkOutStaffs,
                                     },
                             },
                          ],
                       }),
                    },
                 }
               : null,
         ].filter(Boolean),
         order: [['createdAt', 'desc']],
      }).catch(() => {
         throw createError(500, '예약건 검색 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const editRsvnDAO = async (bodyData, staffId, transaction) => {
   try {
      const {
         rsvnId,
         statusCode,
         roomNumber,
         arrivalDate,
         departureDate,
         arrivalTime,
         departureTime,
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

      return await Rsvn.update(
         {
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
         },
         {
            where: { rsvnId },
            ...(!!dailyRatesData && { dailyRatesData }),
            staffId,
            transaction,
            individualHooks: true,
         }
      ).catch(() => {
         throw createError(500, '예약수정 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const assignRoomToRsvnDAO = async (
   id,
   roomNumber,
   staffId,
   transaction
) => {
   try {
      await Rsvn.update(
         { roomNumber: roomNumber },
         {
            where: { rsvnId: id, statusCode: 'RR' },
            transaction,
            staffId,
            individualHooks: true,
         }
      ).catch((err) => {
         console.log(err);
         throw createError(500, '객실 배정 중 DB에서 오류발생');
      });

      return await Rsvn.findByPk(id, {
         attributes: ['groupRsvnId'],
      }).catch(() => {
         throw createError('수정된 예약 정보 조회 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const releaseAssignedRoomFromRsvnDAO = async (
   id,
   staffId,
   transaction
) => {
   try {
      return await Rsvn.update(
         { roomNumber: null },
         {
            where: { rsvnId: id, statusCode: 'RR' },
            transaction: transaction,
            staffId,
            individualHooks: true,
         }
      ).catch(() => {
         throw createError(500, '객실 배정 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};
