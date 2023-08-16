import * as roomRateService from '../service/roomRateService.js';

export const initializeRoomRatesInTerm = async (req, res, next) => {
   try {
      const response = await roomRateService.initializeRoomRatesInTermService(
         req.body
      );
      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getAllRoomRatesOfCurrentMonth = async (req, res, next) => {
   try {
      const response =
         await roomRateService.getAllRoomRatesOfCurrentMonthService();
      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getRoomRatesInOptions = async (req, res, next) => {
   try {
      const response = await roomRateService.getRoomRatesInOptionsService(
         req.body
      );

      res.status(200).json(response);
      //존재하는 roomrate만 있으므로, 인덱스(dateXroomtypeXrateType)값이 없다면 0으로 표시될 수 있도록
   } catch (err) {
      next(err);
   }
};

export const getSelectedRoomRate = async (req, res, next) => {
   try {
      const response = await roomRateService.getSelectedRoomRateService(
         req.body
      );

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getRoomRateByIndexes = async (req, res, next) => {
   try {
      const response = await roomRateService.getRoomRateByIndexesService(
         req.query
      );

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

//이미 존재하는 데이터는 update해주고, 존재하지 않는 데이터는 create

//startDate, endDate : "YYYYMMDD"형식의 문자열
//roomTypeCode, rateTypeCdoe : 배열 (선택값 없을 시, 전체로 선택)
//price : Number
export const editRoomRatesInOptions = async (req, res, next) => {
   try {
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

      res.status(200).send('SUCCESS');
   } catch (err) {
      next(err);
   }
};

export const editSpecificRoomRates = async (req, res, next) => {
   try {
      const response = await roomRateService.editSpecificRoomRatesService(
         req.body
      );
      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};
