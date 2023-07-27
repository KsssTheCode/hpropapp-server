import db from './index.js';
import { createId, createError } from '../source/js/function/commonFn.js';

export const beforeDestroyHook = async (groupRsvn, options) => {
   await sequelize.models.Folio.destroy(
      { where: { groupRsvnId: groupRsvn.groupRsvnId } },
      { transaction: options.transaction }
   ).catch(() => {
      throw createError(500, 'Folio삭제 중 DB에서 오류발생');
   });

   await sequelize.models.Reservation.destroy(
      { where: { groupRsvnId: groupRsvn.groupRsvnId } },
      { transaction: options.transaction }
   ).catch(() => {
      throw createError(500, '개별예약 석재 중 DB에서 오류발생');
   });
};

export const beforeRestoreHook = async (groupRsvn, options) => {
   await sequelize.models.Folio.restore(
      { where: { groupRsvnId: groupRsvn.groupRsvnId } },
      { transaction: options.transaction }
   ).catch(() => {
      throw createError(500, 'Folio삭제 중 DB에서 오류발생');
   });

   await sequelize.models.Reservation.restore(
      { where: { groupRsvnId: groupRsvn.groupRsvnId } },
      { transaction: options.transaction }
   ).catch(() => {
      throw createError(500, '개별예약 석재 중 DB에서 오류발생');
   });
};

export const afterCreateHook = async (groupRsvn, options) => {
   let rsvnId = await createId('reservation');
   if (options.detailRsvnsData) {
      const convertedData = await options.detailRsvnsData.map((rsvn) => {
         const rsvnsData = [];
         const dailyRatesData = [];
         const foliosData = [];
         for (let i = 0; i < (rsvn.rooms || 1); i++) {
            rsvnsData.push({
               rsvnId: 'R' + rsvnId,
               statusCode: 'RR',
               guestName: groupRsvn.groupName,
               arrivalDate: rsvn.arrivalDate,
               departureDate: rsvn.departureDate,
               roomTypeCode: rsvn.roomTypeCode,
               rateTypeCode: 'OWN',
               numberOfGuests: rsvn.numberOfGuests,
               groupRsvnId: groupRsvn.groupRsvnId,
               ...(groupRsvn.reference && { reference: groupRsvn.reference }),
               createStaffId: rsvn.createStaffId,
               folioId: 'F' + rsvnId,
               reservatorName: groupRsvn.caller,
               reservatorTel: groupRsvn.callerTel,
            });
            rsvn.dailyRatesData.forEach((data, j) => {
               let number = String(j + 1).padStart(3, '0');
               const dailyRatesDataPerRsvn = {
                  ...data,
                  dailyRateId: 'R' + rsvnId + number,
                  rsvnId: 'R' + rsvnId,
               };
               dailyRatesData.push(dailyRatesDataPerRsvn);
            });

            foliosData.push({
               folioId: 'F' + rsvnId,
               rsvnId: 'R' + rsvnId,
            });

            rsvnId++;
         }
         return { rsvnsData, dailyRatesData, foliosData };
      });

      const rsvnsData = convertedData.map((item) => item.rsvnsData).flat();
      const dailyRatesData = convertedData
         .map((item) => item.dailyRatesData)
         .flat();
      const foliosData = convertedData.map((item) => item.foliosData).flat();
      foliosData.push({
         folioId: 'F' + groupRsvn.groupRsvnId,
         groupRsvnId: groupRsvn.groupRsvnId,
      });

      await db.Reservation.bulkCreate(rsvnsData, {
         transaction: options.transaction,
         hooks: false,
      }).catch((err) => {
         console.log(err);
         throw createError('단체 개별예약 생성 중 DB에서 오류발생');
      });

      await db.DailyRate.bulkCreate(dailyRatesData, {
         transaction: options.transaction,
         hooks: false,
      }).catch((err) => {
         console.log(err);
         throw createError('단체 개별예약 일별요금 생성 중 DB에서 오류발생');
      });
      await db.Folio.bulkCreate(foliosData, {
         transaction: options.transaction,
         hooks: false,
      }).catch(() => {
         throw createError(
            500,
            '데이터베이스에서 Folio 생성 중 오류가 발생했습니다'
         );
      });
   }
};

export const afterUpdateHook = async (groupRsvn, options) => {
   await db.models.ReservationChangeHistory.create(
      {
         originContent: groupRsvn.previous(),
         updatedContent: groupRsvn,
         editor: options.staffId,
         updatedTime: moment().format('YYY-MM-DD HH:mm:ss'),
         groupRsvnId: groupRsvn.groupRsvnId,
      },
      {
         transaction: options.transaction,
      }
   ).catch(() => {
      throw createError(500, '변경기록 생성 중 DB에서 오류발생');
   });

   // await db.models.GroupReservation.update(
   //    {
   //       changeHistory: db.Sequelize.fn(
   //          'JSON_ARRAY_APPEND', //사용할 함수 이름
   //          db.Sequelize.col('changeHistory'), //history를 속성컬럼으로 지정
   //          '$', //JSON배열 마지막에 새로운 요소를 추가하도록 함 (루트객체 의미)
   //          JSON.stringify(newHistory) //추가할 객체
   //       ),
   //    },
   //    {
   //       where: { groupRsvnId: groupRsvn.groupRsvnId },
   //       transaction: options.transaction,
   //    }
   // ).catch(() => {
   //    throw createError(500, '변경기록 수정 중 DB에서 오류발생');
   // });
};
