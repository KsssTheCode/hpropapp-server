import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';
import { getDatesBetweenTerm } from '../source/js/function/commonFn.js';
import { Op } from 'sequelize';
const RoomRate = db.RoomRate;

export const initializeRoomRatesInTerm = async (req, res, next) => {
   try {
      const { startDate, endDate, roomTypeCode, rateTypeCode } = req.body;
      //startDate, endDate : "YYYYMMDD"형식의 문자열
      //roomTypeCode, rateTypeCdoe : 배열 (선택값 없을 시, 전체로 선택)
      const term = getDatesBetweenTerm(startDate, endDate);

      const roomRatesArr = [];
      term.forEach((date) => {
         roomTypeCode.forEach((roomTypeCode) => {
            rateTypeCode.forEach((rateTypeCode) => {
               roomRatesArr.push({
                  date,
                  roomTypeCode,
                  rateTypeCode,
                  price: 0,
               });
            });
         });
      });

      // await RoomRate.bulkUpdate(roomRatesArr).catch(() => {
      //    throw createError(500, '초기화 중 DB에서 오류발생');
      // });

      const createdRoomRates = await RoomRate.bulkCreate(roomRatesArr, {
         ignoreDuplicates: true,
      }).catch((err) => {
         console.log(err);
         throw createError(500, '초기화 중 DB에서 오류발생');
      });
      res.status(200).send('초기화 성공');
   } catch (err) {
      next(err);
   }
};

export const getAllRoomRatesOfCurrentMonth = async (req, res, next) => {
   try {
      const currentYearMonth = getDateFormat(8).substr(0, 6);

      const roomRateDatas = await RoomRate.findAll({
         where: {
            date: {
               [Op.between]: [currentYearMonth + '01', currentYearMonth + '31'],
            },
         },
      }).catch(() => {
         throw createError(500, '객실조회 중 DB에서 오류발생');
      });
      res.status(200).json(roomRateDatas);
   } catch (err) {
      next(err);
   }
};

export const getRoomRatesInOptions = async (req, res, next) => {
   try {
      //startDate, endDate : "YYYYMMDD"형식의 문자열
      //roomTypeCode, rateTypeCdoe : 배열 (선택값 없을 시, 전체로 선택)
      const { startDate, endDate, rateTypeCode, roomTypeCode } = req.body;

      const roomRateDatas = await RoomRate.findAll({
         attributes: ['price', 'rateTypeCode', 'roomTypeCode', 'date'],
         where: {
            date: { [Op.between]: [+startDate, +endDate] },
            roomTypeCode: { [Op.in]: roomTypeCode },
            rateTypeCode: { [Op.in]: rateTypeCode },
         },
      }).catch((err) => {
         throw createError(500, '객실료 조회 중 DB에서 오류발생');
      });

      res.status(200).json(roomRateDatas);
      //존재하는 roomrate만 있으므로, 인덱스(dateXroomtypeXrateType)값이 없다면 0으로 표시될 수 있도록
   } catch (err) {
      next(err);
   }
};

export const getSelectedRoomRate = async (req, res, next) => {
   try {
      const { roomRateId } = req.body;
      const roomRateData = await RoomRate.findByPk(roomRateId).catch(() => {
         throw createError(500, '객실료 조회 중 DB에서 오류발생');
      });

      res.status(200).json(roomRateData);
   } catch (err) {
      next(err);
   }
};

export const getRoomRateByIndexes = async (req, res, next) => {
   try {
      const { roomTypeCode, rateTypeCode, startDate, endDate } = req.query;
      let term = getDatesBetweenTerm(startDate, endDate);
      const roomRatesData = await RoomRate.findAll({
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

      res.status(200).json(roomRatesData);
   } catch (err) {
      next(err);
   }
};

//이미 존재하는 데이터는 update해주고, 존재하지 않는 데이터는 create
export const editRoomRatesInOptions = async (req, res, next) => {
   const transaction = await db.sequelize.transaction();
   try {
      //startDate, endDate : "YYYYMMDD"형식의 문자열
      //roomTypeCode, rateTypeCdoe : 배열 (선택값 없을 시, 전체로 선택)
      //price : Number
      const { startDate, endDate, roomTypeCodes, rateTypeCodes, newPrice } =
         req.body;

      const term = getDatesBetweenTerm(startDate, endDate);

      await RoomRate.bulkUpdate(
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

      await RoomRate.bulkCreate(
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

      await transaction.commit();
      res.status(200).send('변경완료');
   } catch (err) {
      await transaction.rollback();
      next(err);
   }
};

export const editSpecificRoomRates = async (req, res, next) => {
   const transaction = await db.sequelize.transaction();
   try {
      const { editObjects } = req.body;

      const isExistingRoomRates = [];
      const notExistingRoomRates = [];
      //만약 해달 날짜에 정보가 없다면 생성

      for await (let obj of editObjects) {
         const foundRoomRate = await RoomRate.findOne({
            where: {
               date: obj.date,
               rateTypeCode: obj.rateTypeCode,
               roomTypeCode: obj.roomTypeCode,
            },
         }).catch(() => {
            throw createError(500, '객실료 조회 중 DB에서 오류발생');
         });

         foundRoomRate
            ? isExistingRoomRates.push(obj)
            : notExistingRoomRates.push(obj);
      }

      for await (let obj of isExistingRoomRates) {
         await RoomRate.update(
            {
               price: obj.newPrice,
            },
            {
               where: {
                  rateTypeCode: obj.rateTypeCode,
                  roomTypeCode: obj.roomTypeCode,
                  date: obj.date,
               },
               transaction: transaction,
            }
         ).catch((err) => {
            throw createError(500, '객실료 변경 중 DB에서 오류 발생');
         });
      }
      await RoomRate.bulkCreate(notExistingRoomRates, {
         transaction: transaction,
      }).catch(() => {
         throw createError(500, '객실료 생성 중 DB에서 오류발생');
      });

      await transaction.commit();
      res.status(200).send('변경완료');
   } catch (err) {
      await transaction.rollback();
      next(err);
   }
};
