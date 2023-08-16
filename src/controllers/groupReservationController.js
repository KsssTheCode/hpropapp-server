import * as groupRsvnService from '../service/groupReservationService.js';

import randomName from 'korean-name-generator';

export const createGroupRsvn = async (req, res, next) => {
   try {
      const response = groupRsvnService.createGroupRsvnService(req.body);

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const createDetailRsvns = async (req, res, next) => {
   try {
      const response = await groupRsvnService.createDetailRsvns(req.body);

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getSelectedGroupRsvn = async (req, res, next) => {
   try {
      const response = await groupRsvnService.getSelectedGroupRsvnService(
         req.body
      );

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getGroupRsvnsInFilterOptions = async (req, res, next) => {
   try {
      const response =
         await groupRsvnService.getGroupRsvnsInFilterOptionsService(req.body);

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const editGroupRsvn = async (req, res, next) => {
   try {
      const staffId = req.cookies.staffId;
      await groupRsvnService.editGroupRsvn(req.body, staffId);

      res.status(200).send('SUCCESS');
   } catch (err) {
      next(err);
   }
};

export const deleteDetailRsvns = async (req, res, next) => {
   try {
      const response = await groupRsvnService.deleteDetailRsvnsService(
         req.body
      );

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

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
