import moment from 'moment';
import randomName from 'korean-name-generator';
import { Op } from 'sequelize';
import db from '../models/index.js';
import {
   createError,
   createId,
   getDatesBetweenTerm,
} from '../source/js/function/commonFn.js';

const GroupRsvn = db.GroupReservation;

export const createTestRsvns = async (req, res, next) => {
   const transaction = await db.sequelize.transaction();

   function randomNumber() {
      const min = 10000000;
      const max = 99999999;
      return Math.floor(Math.random() * (max - min + 1)) + min;
   }

   try {
      const groupRsvns = [];
      let groupRsvnId = await createId('GroupReservation');
      const groupExample = [
         '산악회',
         '은행',
         '건설사',
         '모임',
         '여행사',
         '학회',
         '를 사랑하는 모임',
         '축구교실',
         '생일파티',
         '컨퍼런스',
      ];
      for (let i = 0; i < 10; i++) {
         let groupRsvn = {
            groupName: randomName.generate(true) + groupExample[i],
            groupRsvnId: 'G' + groupRsvnId,
            arrivalDate: moment().format('YYYYMMDD'),
            leaderTel: '010' + randomNumber(),
            statusCode: 'RR',
            createStaffId: '230730001',
         };

         if (i % 2 === 0) {
            groupRsvn.departureDate = moment().add(4, 'day').format('YYYYMMDD');
            groupRsvn.leaderName = randomName.generate(true);
         } else {
            groupRsvn.departureDate = moment().add(6, 'day').format('YYYYMMDD');
            groupRsvn.leaderName = randomName.generate(false);
            groupRsvn.caller = randomName.generate(true);
            groupRsvn.callerTel = '010' + randomNumber();
         }

         const detailRsvns = [];
         for (let j = 0; j < 8; j++) {
            let detailRsvn = {};
            if (j % 2 === 0) {
               detailRsvn = {
                  guestName: randomName.generate(true),
                  arrivalDate: groupRsvn.arrivalDate,
                  departureDate: groupRsvn.departureDate,
                  roomTypeCode: 'ODD',
                  numberOfGuests: 2,
               };
            } else if (j % 3 === 0) {
               detailRsvn = {
                  guestName: randomName.generate(false),
                  arrivalDate: moment(groupRsvn.arrivalDate, 'YYYYMMDD')
                     .add(1, 'day')
                     .format('YYYYMMDD'),
                  departureDate: moment(groupRsvn.departureDate, 'YYYYMMDD')
                     .subtract(2, 'days')
                     .format('YYYYMMDD'),
                  roomTypeCode: 'ODP',
                  numberOfGuests: 3,
               };
            } else {
               detailRsvn = {
                  guestName: randomName.generate(true),
                  arrivalDate: groupRsvn.arrivalDate,
                  departureDate: moment(groupRsvn.departureDate, 'YYYYMMDD')
                     .subtract(1, 'days')
                     .format('YYYYMMDD'),
                  roomTypeCode: 'OFT',
                  numberOfGuests: 4,
               };
            }

            const dateArray = getDatesBetweenTerm(
               detailRsvn.arrivalDate,
               detailRsvn.departureDate
            );

            const dailyRatesData = dateArray.map((date) => {
               return {
                  date: date,
                  price: 200000,
               };
            });

            detailRsvn.dailyRatesData = dailyRatesData;
            detailRsvns.push(detailRsvn);
         }

         groupRsvn.detailRsvns = detailRsvns;
         groupRsvns.push(groupRsvn);
         +groupRsvnId++;
      }

      let rsvnId = await createId('reservation');
      for await (const rsvn of groupRsvns) {
         const { detailRsvns, ...groupRsvn } = rsvn;
         await GroupRsvn.create(groupRsvn).catch(() => {
            throw createError('그룹예약건 생성 중 DB에서 오류발생');
         });

         for await (const detail of detailRsvns) {
            const { dailyRatesData, ...detailRsvn } = detail;
            detailRsvn.groupRsvnId = rsvn.groupRsvnId;
            detailRsvn.rsvnId = 'R' + rsvnId;
            detailRsvn.rateTypeCode = 'OWN';
            detailRsvn.statusCode = 'RR';
            detailRsvn.createStaffId = rsvn.createStaffId;
            await db.Reservation.create(detailRsvn, {
               transaction: transaction,
               dailyRatesData,
            }).catch(() => {
               throw createError('그룹 내 개별예약 생성 중 DB에서 오류발생');
            });
            +rsvnId++;
         }
      }

      await transaction.commit();
      res.status(200).send('생성 성공');
   } catch (err) {
      await transaction.rollback();
      next(err);
   }
};

export const createGroupRsvn = async (req, res, next) => {
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
      } = req.body;

      let groupRsvnId = await createId('GroupReservation');
      const response = await GroupRsvn.create(
         {
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
            createStaffId: req.cookies.staffId,
            callerName: caller,
            callerTel: callerTel,
         },
         { returning: true }
      ).catch((err) => {
         console.log(err);
         throw createError(500, '단체마스터예약 생성 중 DB에서 오류발생');
      });

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const createDetailRsvns = async (req, res, next) => {
   const transaction = await db.sequelize.transaction();
   try {
      const { groupRsvnId, detailReservationsData } = req.body;
      const groupRsvn = await GroupRsvn.findByPk(groupRsvnId).catch((err) => {
         next(err);
      });

      let rsvnId = await createId('reservation');
      const rsvnsData = [];
      const dailyRatesData = [];
      const foliosData = [];
      for (let i = 0; i < detailReservationsData.rooms; i++) {
         rsvnsData.push({
            rsvnId: 'R' + rsvnId,
            statusCode: 'RR',
            guestName: groupRsvn.groupName,
            arrivalDate: detailReservationsData.arrivalDate,
            departureDate: detailReservationsData.departureDate,
            roomTypeCode: detailReservationsData.roomTypeCode,
            rateTypeCode: 'OWN',
            numberOfGuests: detailReservationsData.numberOfGuests,
            groupRsvnId: groupRsvn.groupRsvnId,
            ...(groupRsvn.reference && { reference: groupRsvn.reference }),
            createStaffId: 230716002,
            folioId: 'F' + rsvnId,
            reservatorName: groupRsvn.caller,
            reservatorTel: groupRsvn.callerTel,
         });

         foliosData.push({
            folioId: 'F' + rsvnId,
            rsvnId: 'R' + rsvnId,
         });

         detailReservationsData.dailyRatesData.forEach((data, j) => {
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

      const createdRsvns = await db.Reservation.bulkCreate(rsvnsData, {
         transaction: transaction,
         returning: true,
         hooks: false,
      }).catch((err) => {
         console.log(err);
         throw createError('단체 개별예약 생성 중 DB에서 오류발생');
      });

      await db.DailyRate.bulkCreate(dailyRatesData, {
         transaction: transaction,
         hooks: false,
      }).catch((err) => {
         console.log(err);
         throw createError('단체 개별예약 일별요금 생성 중 DB에서 오류발생');
      });

      await db.Folio.bulkCreate(foliosData, {
         transaction: transaction,
         hooks: false,
      }).catch(() => {
         throw createError(
            500,
            '데이터베이스에서 Folio 생성 중 오류가 발생했습니다'
         );
      });

      transaction.commit();
      res.status(200).json(createdRsvns);
   } catch (err) {
      transaction.rollback();
      next(err);
   }
};

export const getSelectedGroupRsvn = async (req, res, next) => {
   try {
      const { id } = req.query;

      const groupRsvn = await GroupRsvn.findByPk(id, {
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

      res.status(200).json(groupRsvn);
   } catch (err) {
      next(err);
   }
};

export const getGroupRsvnsInOptions = async (req, res, next) => {
   try {
      const {
         keyword,
         arrivalStartDate,
         arrivalEndDate,
         departureStartDate,
         departureEndDate,
      } = req.query;
      let {
         createStaffs,
         checkInStaffs,
         checkOutStaffs,
         statusCodes,
         createStartDate,
         createEndDate,
      } = req.query;

      if (createStartDate !== undefined && createEndDate !== undefined) {
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

      const groupRsvnsData = await GroupRsvn.findAll({
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
      }).catch((err) => {
         console.log(err);
         throw createError(500, '단체 검색 중 DB에서 오류발생');
      });

      res.status(200).json(groupRsvnsData);
   } catch (err) {
      next(err);
   }
};

export const editGroupRsvn = async (req, res, next) => {
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
      } = req.body;

      await GroupRsvn.update(
         {
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
         },
         {
            where: { groupRsvnId: groupRsvnId },
            transaction: transaction,
         }
      ).catch(() => {
         throw createError(500, '예약수정 중 DB에서 오류발생');
      });

      for await (let rsvn of detailRsvns) {
         db.Reservation.update(
            {
               status: rsvn.status,
               arrivalDate: rsvn.arrivalDate,
               departureDate: rsvn.departureDate,
               numberOfGuests: rsvn.numberOfGuests,
               guestName: rsvn.guestName,
               roomTypeCode: rsvn.roomTypeCode,
               rateTypeCode: rsvn.rateTypeCode,
            },
            {
               where: { rsvnId: rsvn.rsvnId },
               transaction: transaction,
               staffId: req.cookies.staffId,
            }
         ).catch(() => {
            throw createError(500, '예약수정 중 DB에서 오류발생');
         });
      }

      transaction.commit();
      res.status(200).send('단체예약 수정완료');
   } catch (err) {
      transaction.rollback();
      next(err);
   }
};

export const cancelGroupRsvn = async (req, res, next) => {
   const transaction = await db.sequelize.transaction();
   try {
      const { groupRsvnId } = req.body;
      await GroupRsvn.destroy({ where: { groupRsvnId: groupRsvnId } }).catch(
         () => {
            throw createError(500, '단체예약 삭제 중 DB에서 오류발생');
         }
      );

      await transaction.commit();
      res.status(200).send('단체예약 및 관련예약 삭제완료');
   } catch (err) {
      transaction.rollback();
      next(err);
   }
};

export const deleteDetailRsvns = async (req, res, next) => {
   const transaction = await db.sequelize.transaction();
   try {
      const { rsvnIds } = req.body;
      await db.Reservation.destroy({
         where: { rsvnId: { [Op.in]: rsvnIds } },
         transaction: transaction,
         rsvnIds,
      }).catch(() => {
         throw createError(
            500,
            '단체 예약 내 개별예약 삭제 중 DB에서 오류발생'
         );
      });

      await transaction.commit();
      res.status(200).send(`${rsvnIds.length}개의 개별예약 삭제완료`);
   } catch (err) {
      await transaction.rollback();
      next(err);
   }
};
