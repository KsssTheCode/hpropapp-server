import * as dailyRateService from '../service/dailyRateService.js';

//arrivalDate, departureDate, roomTypeCode, rateTypeCode 모두가 작성완료될 시, 촉발되는 method
//작성완료 후 변경될 시에도 촉발됨
export const getNewDailyRate = async (req, res, next) => {
   try {
      const response = await dailyRateService.getNewDailyRateService(req.body);
      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const editSpecificRsvnDailyRate = async (req, res, next) => {
   try {
      const response = await dailyRateService.editSpecificRsvnDailyRateService(
         req.body
      );
      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};
// export const getNewDailyRate = async (req, res, next) => {
//    const transaction = db.sequelize.transaction();
//    try {
//       const { arrivalDate, departureDate, roomTypeCode, rateTypeCode, rsvnId } =
//          req.body;

//       await DailyRate.destroy({
//          where: { rsvnId: rsvnId },
//          transaction: transaction,
//          force: true,
//       }).catch(() => {
//          throw createError(500, '기존 일별요금 삭제 중 DB에서 오류발생');
//       });

//       const dateTerm = getDatesBetweenTerm(arrivalDate, departureDate);

//       const newDailyRateDatas = [];
//       let number = '001';
//       for await (let date of dateTerm) {
//          const price = await db.RoomRate.findOne(
//             { attributes: ['price'] },
//             {
//                where: {
//                   date: date,
//                   roomTypeCode: roomTypeCode,
//                   rateTypeCode: rateTypeCode,
//                },
//                transaction: transaction,
//                returning: true,
//             }
//          );

//          const newDailyRate = await DailyRate.create(
//             {
//                dailyRateId: rsvnId.slice(1) + number,
//                date: date,
//                price: price,
//                rsvnId: rsvnId,
//             },
//             { transaction: transaction, returning: true }
//          );

//          newDailyRateDatas.push(newDailyRate);
//       }

//       transaction.commit();
//       res.status(200).json(newDailyRateDatas);
//    } catch (err) {
//       transaction.rollback();
//       next(err);
//    }
// };

// export const editSpecificRsvnDailyRate = async (req, res, next) => {
//    const transaction = db.sequelize.transaction();
//    try {
//       const response = await dailyRateService.editSpecificRsvnDailyRateService(req.body);

//       for await (let data of newDailyRateDatas) {
//          await DailyRate.update(
//             { price: data.price },
//             {
//                where: { dailyRateId },
//                transaction: transaction,
//             }
//          );
//       }
//       transaction.commit();
//       res.status(200).send('일별요금 수정성공');
//    } catch (err) {
//       transaction.rollback();
//       next(err);
//    }
// };
