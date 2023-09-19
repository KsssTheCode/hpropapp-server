import { Op } from 'sequelize';
import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';

const GroupRsvn = db.GroupReservation;

export const createGroupRsvnDAO = async (createData) => {
   try {
      const response = await GroupRsvn.create(createData, {
         returning: true,
      }).catch((err) => {
         throw createError(500, '단체마스터예약 생성 중 DB에서 오류발생');
      });
      return response;
   } catch (err) {
      throw err;
   }
};

export const getGroupRsvnByIdDAO = async (groupRsvnId) => {
   try {
      return await GroupRsvn.findByPk(groupRsvnId).catch(() => {
         throw createError(500, '단쳬예약 검색 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const createGroupDetailRsvnsDAO = async (rsvnsData, transaction) => {
   try {
      return await db.Reservation.bulkCreate(rsvnsData, {
         transaction: transaction,
         returning: true,
         hooks: false,
      }).catch(() => {
         throw createError('단체 개별예약 생성 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const createGroupDetailRsvnsDailyRatesDataDAO = async (
   dailyRatesData,
   transaction
) => {
   try {
      await db.DailyRate.bulkCreate(dailyRatesData, {
         transaction: transaction,
         hooks: false,
      }).catch(() => {
         throw createError('단체 개별예약 일별요금 생성 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const createGroupDetailRsvnsFolioDAO = async (
   foliosData,
   transaction
) => {
   try {
      const response = await db.Folio.bulkCreate(foliosData, {
         transaction: transaction,
         hooks: false,
         returning: true,
      }).catch(() => {
         throw createError(
            500,
            '데이터베이스에서 Folio 생성 중 오류가 발생했습니다'
         );
      });

      return response;
   } catch (err) {
      throw err;
   }
};

export const getSelectedGroupRsvnDAO = async (id) => {
   try {
      return await GroupRsvn.findByPk(id, {
         include: [
            {
               model: db.Reservation,
               include: {
                  model: db.DailyRate,
               },
            },
            { model: db.ReservationChangeHistory },
         ],
      }).catch(() => {
         throw createError(500, '단체예약 조회 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const getGroupRsvnsInFilterOptionsDAO = async ({
   keyword,
   arrivalStartDate,
   arrivalEndDate,
   departureStartDate,
   departureEndDate,
   createStaffs,
   checkInStaffs,
   checkOutStaffs,
   statusCodes,
   createStartDate,
   createEndDate,
}) => {
   try {
      return await GroupRsvn.findAll({
         where: {
            ...(keyword && {
               [Op.or]: [
                  { groupRsvnId: { [Op.like]: `%${keyword}%` } },
                  { groupName: { [Op.like]: `%${keyword}%` } },
                  { leaderName: { [Op.like]: `%${keyword}%` } },
                  { leaderTel: { [Op.like]: `%${keyword}%` } },
                  { companyName: { [Op.like]: `%${keyword}%` } },
                  { companyAddress: { [Op.like]: `%${keyword}%` } },
                  { companyTel: { [Op.like]: `%${keyword}%` } },
                  { reference: { [Op.like]: `%${keyword}%` } },
               ],
            }),
            ...(statusCodes &&
               (statusCodes.includes(',')
                  ? { statusCode: { [Op.in]: statusCodes.split(',') } }
                  : { statusCode: { [Op.eq]: statusCodes } })),
            ...(arrivalStartDate &&
               arrivalEndDate !== undefined && {
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
      }).catch(() => {
         throw createError(500, '단체 검색 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const editGroupRsvnDAO = async (
   groupRsvnId,
   updateData,
   staffId,
   transaction
) => {
   try {
      await GroupRsvn.update(updateData, {
         where: { groupRsvnId: groupRsvnId },
         transaction: transaction,
         staffId,
      }).catch(() => {
         throw createError(500, '예약수정 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const editGroupDetailRsvnDAO = async (
   updateData,
   rsvnId,
   staffId,
   transaction
) => {
   try {
      await db.Reservation.update(updateData, {
         where: { rsvnId },
         transaction: transaction,
         staffId,
      }).catch(() => {
         throw createError(500, '예약수정 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const deleteDetailRsvnsDAO = async (rsvnIds, transaction) => {
   try {
      return await db.Reservation.destroy({
         where: { rsvnId: { [Op.in]: rsvnIds } },
         transaction: transaction,
         rsvnIds,
      }).catch(() => {
         throw createError(
            500,
            '단체 예약 내 개별예약 삭제 중 DB에서 오류발생'
         );
      });
   } catch (err) {
      throw err;
   }
};
