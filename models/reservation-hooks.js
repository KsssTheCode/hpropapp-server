import db from './index.js';
import {
   createError,
   getChangeHistoryMessage,
} from '../source/js/function/commonFn.js';
import { Op } from 'sequelize';

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
   console.log('rsvn:' + rsvn);
   try {
      const newHistory = await getChangeHistoryMessage(rsvn.previous(), rsvn, [
         'rsvnId',
      ]);

      await db.sequelize.models.Reservation.update(
         {
            changeHistory: db.Sequelize.fn(
               'JSON_ARRAY_APPEND', //사용할 함수 이름
               db.Sequelize.col('changeHistory'), //history를 속성컬럼으로 지정
               '$', //JSON배열 마지막에 새로운 요소를 추가하도록 함 (루트객체 의미)
               JSON.stringify(newHistory) //추가할 객체
            ),
         },
         {
            transaction: options.transaction,
            where: { rsvnId: rsvn.rsvnId },
            hooks: false,
         }
      ).catch((err) => {
         console.log(err);
         throw createError(500, '예약 변경기록 수정 중 DB에서 오류발생');
      });

      const a = await db.sequelize.models.Reservation.findByPk(rsvn.rsvnId);

      console.log(a.changeHistory);

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
   }
};
