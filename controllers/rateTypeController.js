import { Op } from 'sequelize';
import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';

const RateType = db.RateType;

export const getAllRateTypes = async (req, res, next) => {
   try {
      const { attributes } = req.query;
      let attributesArr = null;
      if (attributes) attributesArr = attributes.split(',');
      const rateTypesData = await RateType.findAll({
         attributes: attributesArr,
         where: { deletedAt: null },
      }).catch((err) => {
         throw createError(500, '요금책정형식 조회 중 DB에서 오류발생');
      });

      res.status(200).json(rateTypesData);
   } catch (err) {
      next(err);
   }
};

export const createRateType = async (req, res, next) => {
   try {
      const { rateTypeCode, reference } = req.body;

      await RateType.create({
         rateTypeCode: rateTypeCode,
         reference: reference,
      }).catch(() => {
         throw createError(500, '요금책정형식 생성 중 DB에서 오류발생');
      });

      res.status(200).send('새로운 요금책정형식 생성 성공');
   } catch (err) {
      next(err);
   }
};

export const editRateType = async (req, res, next) => {
   try {
      const { rateTypeCode, reference } = req.body;
      await RoomType.update(
         { reference },
         {
            where: {
               rateTypeCode: rateTypeCode,
            },
         }
      ).catch(() => {
         throw createError(500, '요금책정 정보 변경 중 DB에서 오류발생');
      });

      res.status(200).send('요금책정코드 변경완료');
   } catch (err) {
      next(err);
   }
};

export const deleteRateType = async (req, res, next) => {
   try {
      const { rateTypeCode } = req.body;
      await RateType.destroy({
         where: { rateTypeCode: rateTypeCode },
      }).catch(() => {
         throw createError(500, '요금책정형식 삭제 중 DB에서 오류발생');
      });

      res.status(200).send('요금책정방식 삭제완료');
   } catch (err) {
      next(err);
   }
};
