import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';

const ReservationStatus = db.ReservationStatus;

export const getReservationStatus = async (req, res, next) => {
   try {
      const rsvnStatusData = await ReservationStatus.findAll({
         attributes: ['statusCode'],
      }).catch(() => {
         throw createError(500, '예약상태 조회 중 DB에서 오류발생');
      });

      res.status(200).json(rsvnStatusData);
   } catch (err) {
      next(err);
   }
};

export const createReservationStatus = async (req, res, next) => {
   try {
      const { statusCode, statusName } = req.body;
      await ReservationStatus.create({ statusCode, statusName }).catch(() => {
         throw createError(500, '예약상태 생성 중 DB에서 오류발생');
      });

      res.status(200).send(`예약상태코드(${statusCode}) 생성 완료`);
   } catch (err) {
      next(err);
   }
};

export const deleteReservationStatus = async (req, res, next) => {
   try {
      const { statusCode } = req.body;
      await ReservationStatus.destroy({
         where: { cleanStatusCode: statusCode },
      }).catch(() => {
         throw createError(500, '예약상태 생성 중 DB에서 오류발생');
      });

      res.status(200).send(`예약상태코드(${statusCode}) 삭제 완료`);
   } catch (err) {
      next(err);
   }
};
