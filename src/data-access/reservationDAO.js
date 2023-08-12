import { Op } from 'sequelize';

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
