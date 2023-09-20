import { Op } from 'sequelize';
import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';

const RoomRate = db.RoomRate;

export const initializeRoomRatesInTermDAO = async (roomRatesArr) => {
   try {
      return await RoomRate.bulkCreate(roomRatesArr, {
         ignoreDuplicates: true,
      }).catch((err) => {
         console.log(err);
         throw createError(500, '초기화 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const getAllRoomRatesOfCurrentMonthDAO = async (
   startOfMonth,
   endOfMonth
) => {
   try {
      return await RoomRate.findAll({
         where: {
            date: {
               [Op.between]: [+startOfMonth, +endOfMonth],
            },
         },
      }).catch(() => {
         throw createError(500, '객실조회 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const getRoomRatesInOptionsDAO = async (searchOptions) => {
   try {
      const { startDate, endDate, roomTypeCode, rateTypeCode } = searchOptions;

      return await RoomRate.findAll({
         attributes: ['price', 'rateTypeCode', 'roomTypeCode', 'date'],
         where: {
            date: { [Op.between]: [+startDate, +endDate] },
            roomTypeCode: { [Op.in]: roomTypeCode },
            rateTypeCode: { [Op.in]: rateTypeCode },
         },
      }).catch(() => {
         throw createError(500, '객실료 조회 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const getRoomRateByIndexesDAO = async (
   roomTypeCode,
   rateTypeCode,
   term
) => {
   try {
      return await RoomRate.findAll({
         where: {
            roomTypeCode: roomTypeCode,
            rateTypeCode: rateTypeCode,
            date: { [Op.in]: term },
         },
         attributes: ['date', 'price'],
      }).catch((err) => {
         console.log(err);
         throw createError(500, '날짜별 객실료 조회 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};
export const updateRoomRatesInOptionsDAO = async (
   term,
   roomTypeCodes,
   rateTypeCodes,
   newPrice,
   transaction
) => {
   try {
      return await RoomRate.bulkUpdate(
         {
            price: newPrice,
         },
         {
            where: {
               date: { [Op.in]: term },
               roomTypeCode: { [Op.in]: roomTypeCodes },
               rateTypeCode: { [Op.in]: rateTypeCodes },
            },
         },
         { transaction: transaction }
      ).catch(() => {
         throw createError(500, '변경된 객실료로 수정 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};
export const createRoomRatesInOptionsDAO = async (
   term,
   roomTypeCodes,
   rateTypeCodes,
   newPrice,
   transaction
) => {
   try {
      return await RoomRate.bulkCreate(
         {
            date: { [Op.in]: term },
            roomTypeCode: { [Op.in]: roomTypeCodes },
            rateTypeCode: { [Op.in]: rateTypeCodes },
            price: newPrice,
         },
         { transaction: transaction, ignoreDuplicates: true }
      ).catch(() => {
         throw createError(500, '변경된 객실료 생성 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};
export const getSpecificRoomRateDAO = async (
   date,
   rateTypeCode,
   roomTypeCode
) => {
   try {
      return await RoomRate.findOne({
         where: {
            date: date,
            rateTypeCode: rateTypeCode,
            roomTypeCode: roomTypeCode,
         },
      }).catch(() => {
         throw createError(500, '객실료 조회 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};
export const updateSpecificRoomRateDAO = async (
   date,
   rateTypeCode,
   roomTypeCode,
   newPrice,
   transaction
) => {
   try {
      await RoomRate.update(
         {
            price: newPrice,
         },
         {
            where: {
               rateTypeCode: rateTypeCode,
               roomTypeCode: roomTypeCode,
               date: date,
            },
            transaction: transaction,
         }
      ).catch(() => {
         throw createError(500, '객실료 변경 중 DB에서 오류 발생');
      });
   } catch (err) {
      throw err;
   }
};

export const createRoomRatesInArrayDAO = async (
   roomRatesArray,
   transaction
) => {
   try {
      await RoomRate.bulkCreate(roomRatesArray, {
         transaction: transaction,
      }).catch(() => {
         throw createError(500, '객실료 생성 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};
