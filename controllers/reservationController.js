import moment from 'moment';
import db from '../models/index.js';
import { createError, createId } from '../source/js/function/commonFn.js';

import { Op } from 'sequelize';

const Rsvn = db.Reservation;
const Memo = db.Memo;

export const createRsvn = async (req, res, next) => {
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
      } = req.body;
      let { arrivalTime, departureTime } = req.body;

      let rsvnId = await createId('reservation');
      rsvnId = 'R' + rsvnId;
      if (arrivalTime) arrivalTime = arrivalTime.replace(':', '');
      if (departureTime) departureTime = departureTime.replace(':', '');

      const response = await Rsvn.create(
         {
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
            createStaffId: 230716002,
         },
         {
            transaction: transaction,
            dailyRatesData,
            returning: true,
         }
      ).catch((err) => {
         console.log(err);
         throw createError(500, '예약생성 중 DB에서 오류발생');
      });

      await transaction.commit();
      res.status(200).json(response);
   } catch (err) {
      await transaction.rollback();
      next(err);
   }
};

export const getRsvnsInOptions = async (req, res, next) => {
   try {
      const {
         keyword,
         arrivalStartDate,
         arrivalEndDate,
         departureStartDate,
         departureEndDate,
      } = req.query;
      let {
         rateTypeCodes,
         roomTypeCodes,
         statusCodes,
         createStaffs,
         checkInStaffs,
         checkOutStaffs,
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

      console.log(rateTypeCodes); //COM,EPD

      const rsvnsData = await Rsvn.findAll({
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
            // ...(createStaffs &&
            //    (createStaffs.includes(',')
            //       ? { createStaffId: { [Op.in]: createStaffs.split(',') } }
            //       : { createStaffId: { [Op.eq]: createStaffs } })),
            // ...(checkInStaffs &&
            //    (checkInStaffs.includes(',')
            //       ? { checkInStaffId: { [Op.in]: checkInStaffs.split(',') } }
            //       : { checkInStaffId: { [Op.eq]: checkInStaffs } })),
            // ...(checkOutStaffs &&
            //    (checkOutStaffs.includes(',')
            //       ? { checkOutStaffId: { [Op.in]: checkOutStaffs.split(',') } }
            //       : { checkOutStaffId: { [Op.eq]: checkOutStaffs } })),
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
         order: [['createdAt', 'desc']],
      }).catch((err) => {
         console.log(err);
         throw createError(500, '예약건 검색 중 DB에서 오류발생');
      });

      res.status(200).json(rsvnsData);
   } catch (err) {
      next(err);
   }
};

// export const getCanceledRsvnsInOptions = async (req, res, next) => {
//    try {
//       const {
//          keyword,
//          statusCode,
//          cautionYN,
//          roomTypeCodes,
//          rateTypeCodes,
//          startDate,
//          endDate,
//       } = req.body;

//       const rsvnDatas = await Rsvn.findAll({
//          where: {
//             rsvnId: { [Op.like]: `%${keyword}%` },
//             guestName: { [Op.like]: `%${keyword}%` },
//             tel1: { [Op.like]: `%${keyword}%` },
//             tel2: { [Op.like]: `%${keyword}%` },
//             reservatorName: { [Op.like]: `%${keyword}%` },
//             reservatorTel: { [Op.like]: `%${keyword}%` },
//             statusCode: { [Op.in]: statusCode },
//             cautionYN: cautionYN,
//             roomTypeCode: { [Op.in]: roomTypeCodes },
//             rateTypeCode: { [Op.in]: rateTypeCodes },
//             arrivalDate: { [Op.between]: [startDate, endDate] },
//             departureDate: { [Op.between]: [startDate, endDate] },
//             deletedAt: { [Op.not]: null },
//          },
//          order: [['createdAt', 'desc']],
//       }).catch(() => {
//          throw createError(500, '예약건 검색 중 DB에서 오류발생');
//       });

//       res.status(200).json(rsvnDatas);
//    } catch (err) {
//       next(err);
//    }
// };

export const getSelectedRsvn = async (req, res, next) => {
   try {
      const { id } = req.query;

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
            {
               model: db.Member,
               attributes: ['memberId'],
            },
         ],
      }).catch((err) => {
         console.log(err);
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
      }).catch((err) => {
         console.log(err);
         throw createError(500, '객실가격 중 DB에서 오류발생');
      });

      const responseData = {
         ...rsvnData.get(),
         RoomRates: roomRatesData.map((roomRate) => roomRate.get()),
      };

      res.status(200).json(responseData);
   } catch (err) {
      next(err);
   }
};

export const getRsvnChangeHistory = async (req, res, next) => {
   try {
      const { rsvnId } = req.body;
      const changeHistory = await Rsvn.findOne({
         attributes: ['changeHistory'],
         where: {
            rsvnId: rsvnId,
         },
      }).catch(() => {
         throw createError(500, '예약건 변경기록 조회 중 DB에서 오류발생');
      });

      res.status(200).data(changeHistory);
   } catch (err) {
      next(err);
   }
};

export const editRsvn = async (req, res, next) => {
   const transaction = await db.sequelize.transaction();
   try {
      const {
         rsvnId,
         statusCode,
         roomNumber,
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
      } = req.body;
      let { arrivalTime, departureTime } = req.body;

      if (arrivalTime) arrivalTime = arrivalTime.replace(':', '');
      if (departureTime) departureTime = departureTime.replace(':', '');

      const response = await Rsvn.update(
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
            where: { rsvnId: rsvnId },
            transaction: transaction,
            ...(!!dailyRatesData && { dailyRatesData: dailyRatesData }),
            individualHooks: true,
         }
      ).catch((err) => {
         console.log(err);
         throw createError(500, '예약수정 중 DB에서 오류발생');
      });
      await transaction.commit();
      res.status(200).json(response[1]);
   } catch (err) {
      console.log(err);
      await transaction.rollback();
      next(err);
   }
};

export const assignRoomToRsvn = async (req, res, next) => {
   try {
      const { id, roomNumber } = req.body;
      await Rsvn.update(
         { roomNumber: roomNumber },
         {
            where: { rsvnId: id, statusCode: 'RR' },
            hooks: false,
         }
      ).catch(() => {
         throw createError(500, '객실 배정 중 DB에서 오류발생');
      });

      const updatedDataGroupRsvnId = await Rsvn.findByPk(id, {
         attributes: ['groupRsvnId'],
      }).catch((err) => {
         console.log(err);
         throw createError('수정된 예약 정보 조회 중 DB에서 오류발생');
      });

      res.status(200).json(updatedDataGroupRsvnId.groupRsvnId);
   } catch (err) {
      next(err);
   }
};

export const releaseAssignedRoomFromRsvn = async (req, res, next) => {
   try {
      const { id } = req.body;
      console.log(id);
      await Rsvn.update(
         { roomNumber: null },
         { where: { rsvnId: id, statusCode: 'RR' }, hooks: false }
      ).catch((err) => {
         console.log(err);
         throw createError(500, '객실 배정 중 DB에서 오류발생');
      });
      res.status(200).send('객실배정 성공');
   } catch (err) {
      next(err);
   }
};

//이 메소드가 필요할지 모르곘네...
// export const editStatusOnly = async (req, res, next) => {
//    const transaction = db.sequelize.transaction();
//    try {
//       const { rsvnId, status } = req.body;

//       await Rsvn.update(
//          { status: status },
//          { where: { rsvnId: rsvnId }, transaction: transaction }
//       ).catch(() => {
//          throw createError(500, '상태변경 중 DB에서 오류발생');
//       });

//       transaction.commit();
//       res.status(200).send('상태 변경 성공');
//    } catch (err) {
//       transaction.rollback();
//       next(err);
//    }
// };

export const cancelRsvn = async (req, res, next) => {
   const transaction = db.sequelize.transaction();
   try {
      const { rsvnId } = req.body;
      await Rsvn.update({ status: 'CX' }, { where: { rsvnId: rsvnId } }).catch(
         () => {
            throw createError(500, '예약건 삭제 중 DB에서 오류발생');
         }
      );

      transaction.commit();
      res.status(200).send(`예약건 삭제완료\n (예약번호:${rsvnId})`);
   } catch (err) {
      transaction.rollback();
      next(err);
   }
};
