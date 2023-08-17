import db from './index.js';
import { createError } from '../source/js/function/commonFn.js';
import { Op } from 'sequelize';
import moment from 'moment';

export const afterDestroyHook = async (rsvn, options) => {
   await db.sequelize.models.Folio.destroy({
      where: { rsvnId: { [Op.in]: options.rsvnIds } },
   }).catch(() => {
      throw createError(500, 'Folio삭제 중 DB에서 오류발생');
   });

   await db.sequelize.models.DailyRate.destroy({
      where: { rsvnId: { [Op.in]: options.rsvnIds } },
   }).catch(() => {
      throw createError(500, '일별요금 석재 중 DB에서 오류발생');
   });
};

export const beforeRestoreHook = async (rsvn, options) => {
   await db.sequelize.models.Folio.restore({
      where: { rsvnId: rsvn.rsvnId },
   }).catch(() => {
      throw createError(500, 'Folio복구 중 DB에서 오류발생');
   });
   await db.sequelize.models.DailyRate.restore({
      where: { rsvnId: rsvn.rsvnId },
   }).catch(() => {
      throw createError(500, '일별요금 복구 중 DB에서 오류발생');
   });
};

export const afterCreateHook = async (rsvn, options) => {
   const createData = options.dailyRatesData.map((data, i) => {
      let number = String(i + 1).padStart(3, '0');
      return {
         dailyRateId: rsvn.rsvnId + number,
         date: data.date,
         price: data.price,
         rsvnId: rsvn.rsvnId,
      };
   });

   await db.sequelize.models.DailyRate.bulkCreate(createData, {
      transaction: options.transaction,
      hooks: false,
   }).catch(() => {
      throw createError(
         500,
         '데이터베이스에서 DailyRates 생성 중 오류가 발생했습니다'
      );
   });

   await db.sequelize.models.Folio.create(
      {
         folioId: rsvn.rsvnId.replace('R', 'F'),
         rsvnId: rsvn.rsvnId,
      },
      { transaction: options.transaction, hooks: false }
   ).catch(() => {
      throw createError(
         500,
         '데이터베이스에서 Folio 생성 중 오류가 발생했습니다'
      );
   });
};

export const afterUpdateHook = async (rsvn, options) => {
   try {
      await db.sequelize.models.ReservationChangeHistory.create(
         {
            updatedProperties: rsvn.previous(),
            updatedReservation: rsvn,
            staffId: options.staffId,
            updatedTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            rsvnId: rsvn.rsvnId,
         },
         {
            transaction: options.transaction,
         }
      ).catch((err) => {
         console.log(err);
         throw createError(500, '변경기록 생성 중 DB에서 오류발생');
      });

      if (options.dailyRatesData) {
         await db.sequelize.models.DailyRate.destroy({
            where: { rsvnId: rsvn.rsvnId },
            transaction: options.transaction,
         }).catch(() => {
            throw createError(500, '기존 객실가격 삭제 중 DB에서 오류발생');
         });

         const createData = options.dailyRatesData.map((data, i) => {
            const number = String(i + 1).padStart(3, '0');
            return {
               ...data,
               dailyRateId: rsvn.rsvnId + number,
               rsvnId: rsvn.rsvnId,
            };
         });

         await db.sequelize.models.DailyRate.bulkCreate(createData, {
            transaction: options.transaction,
         }).catch((err) => {
            console.log(err);
            throw createError(
               500,
               '데이터베이스에서 DailyRates 생성 중 오류가 발생했습니다'
            );
         });
      }
   } catch (err) {
      console.log(err);
      throw err;
   }
};
