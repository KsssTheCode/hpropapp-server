import { Op } from 'sequelize';
import { createError } from '../source/js/function/commonFn.js';

import db from '../models/index.js';

const Rsvn = db.Reservation;

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
