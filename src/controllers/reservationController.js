import moment from 'moment';
import randomName from 'korean-name-generator';
import db from '../models/index.js';
import { createId } from '../source/js/function/commonFn.js';

import * as rsvnService from '../service/reservationService.js';

const Rsvn = db.Reservation;

export const createRsvn = async (req, res, next) => {
   try {
      const staffId = req.cookies.staffId;
      const response = await rsvnService.createRsvnService(req.body, staffId);
      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getRsvnsInOptions = async (req, res, next) => {
   try {
      const response = await rsvnService.getRsvnInOptionsService(req.query);
      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getSelectedRsvn = async (req, res, next) => {
   try {
      const { id } = req.query;
      const response = await rsvnService.getSelectedRsvnService(id);
      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const editRsvn = async (req, res, next) => {
   try {
      const staffId = req.cookies.staffId;
      const response = await rsvnService.getRsvnInOptionsService(
         req.body,
         staffId
      );
      res.status(200).json(response[1]);
   } catch (err) {
      next(err);
   }
};

export const assignRoomToRsvn = async (req, res, next) => {
   try {
      const { id, roomNumber } = req.body;
      const staffId = req.cookies.staffId;
      const response = await rsvnService.assignRoomToRsvnService(
         id,
         roomNumber,
         staffId
      );

      res.status(200).json(response.groupRsvnId);
   } catch (err) {
      next(err);
   }
};

export const releaseAssignedRoomFromRsvn = async (req, res, next) => {
   try {
      const { ids } = req.body;
      const staffId = req.cookies.staffId;
      const response = await rsvnService.releaseAssignedRoomFromRsvnService(
         ids,
         staffId
      );

      res.status(200).json(response);
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

// export const cancelRsvn = async (req, res, next) => {
//    const transaction = db.sequelize.transaction();
//    try {
//       const { rsvnId } = req.body;
//       await Rsvn.update({ status: 'CX' }, { where: { rsvnId: rsvnId } }).catch(
//          () => {
//             throw createError(500, '예약건 삭제 중 DB에서 오류발생');
//          }
//       );

//       transaction.commit();
//       res.status(200).send(`예약건 삭제완료\n (예약번호:${rsvnId})`);
//    } catch (err) {
//       transaction.rollback();
//       next(err);
//    }
// };

export const createTestRsvns = async (req, res, next) => {
   const transaction = await db.sequelize.transaction();

   function randomNumber() {
      const min = 10000000;
      const max = 99999999;
      return Math.floor(Math.random() * (max - min + 1)) + min;
   }

   try {
      let rsvns = [];

      let rsvnId = await createId('reservation');
      for (let i = 0; i < 120; i++) {
         let rsvn = {
            rsvnId: 'R' + rsvnId,
            arrivalDate: moment().format('YYYYMMDD'),
            tel1: '010' + randomNumber(),
            statusCode: 'RR',
         };

         if (i % 2 === 0 || i % 7 === 0 || i % 11 === 0) {
            rsvn.guestName = randomName.generate(true);
            rsvn.departureDate = moment().add(1, 'day').format('YYYYMMDD');
            rsvn.createStaffId = '230730001';
            i % 7 === 0
               ? (rsvn.roomTypeCode = 'ODP')
               : i % 11 === 0
               ? (rsvn.roomTypeCode = 'RPV')
               : (rsvn.roomTypeCode = 'OFT');

            i % 4 === 0
               ? (rsvn.rateTypeCode = 'YNZ')
               : rsvn.rateTypeCdoe === 'YAT';

            if (i % 8 === 0) {
               rsvn.caller = randomName.generate(false);
               rsvn.callerTel = '010' + randomNumber();
            }

            let price = 0;
            if (rsvn.roomTypeCode === 'ODP') {
               rsvn.numberOfGuests = 3;
               rsvn.rateTypeCode === 'YNZ'
                  ? (price = 243999)
                  : (price = 250030);
            } else if (rsvn.roomTypeCode === 'OFT') {
               rsvn.numberOfGuests = 4;
               rsvn.rateTypeCode === 'YNZ'
                  ? (price = 332000)
                  : (price = 308500);
            } else if (rsvn.roomTypeCode === 'RPV') {
               rsvn.numbersOfGuests = 7;
               rsvn.rateTypeCode === 'YNZ'
                  ? (price = 1190000)
                  : (price = 999000);
            }
            rsvn.dailyRatesData = [{ date: rsvn.arrivalDate, price }];
         } else {
            rsvn.guestName = randomName.generate(false);
            rsvn.departureDate = moment().add(2, 'day').format('YYYYMMDD');
            rsvn.createStaffId = 230730001;

            i % 13 === 0
               ? (rsvn.roomTypeCode = 'RPV')
               : (rsvn.roomTypeCode = 'ODD');

            i % 3 === 0
               ? (rsvn.rateTypeCode = 'EPD')
               : (rsvn.rateTypeCode = 'BKC');

            if (i % 5 === 0) {
               rsvn.caller = randomName.generate(true);
               rsvn.callerTel = '010' + randomNumber();
            }

            let price = 0;
            if (rsvn.roomTypeCode === 'ODD') {
               rsvn.numberOfGuests = 2;
               rsvn.rateTypeCode === 'BKC'
                  ? (price = 243999)
                  : (price = 250030);
            } else if (rsvn.roomTypeCode === 'RPV') {
               rsvn.numberOfGuests = 8;
               rsvn.rateTypeCode === 'BKC'
                  ? (price = 1190000)
                  : (price = 999000);
            }
            rsvn.dailyRatesData = [
               { date: rsvn.arrivalDate, price },
               { date: moment().add(1, 'day').format('YYYYMMDD'), price },
            ];
         }

         rsvns.push(rsvn);
         +rsvnId++;
      }

      rsvns = rsvns.map((rsvn) => {
         if (!rsvn.rateTypeCode) rsvn.rateTypeCode = 'COM';
         return rsvn;
      });

      for await (let rsvn of rsvns) {
         await Rsvn.create(rsvn, {
            transaction: transaction,
            dailyRatesData: rsvn.dailyRatesData,
         });
      }
      await transaction.commit();
      res.status(200).send('생성완료');
   } catch (err) {
      await transaction.rollback();
      next(err);
   }
};
