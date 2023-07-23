import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';

const CleanStatus = db.CleanStatus;

export const createCleanStatus = async (req, res, next) => {
   try {
      const { statusCode, statusName } = req.body;
      await CleanStatus.create({
         cleanStatusCode: statusCode,
         statusName,
      }).catch((err) => {
         console.log(err);
         throw createError(500, '정비상태 생성 중 DB에서 오류발생');
      });

      res.status(200).send(`정비상태코드(${statusCode}) 생성 완료`);
   } catch (err) {
      next(err);
   }
};

export const deleteCleanStatus = async (req, res, next) => {
   try {
      const { statusCode } = req.body;
      await CleanStatus.destroy({
         where: { cleanStatusCode: statusCode },
      }).catch(() => {
         throw createError(500, '정비상태 생성 중 DB에서 오류발생');
      });

      res.status(200).send(`정비상태코드(${statusCode}) 삭제 완료`);
   } catch (err) {
      next(err);
   }
};

export const getCleanStatuses = async (req, res, next) => {
   try {
      const cleanStatus = await CleanStatus.findAll().catch(() => {
         throw createError(500, '정비상태 조회 중 DB에서 오류발생');
      });

      res.status(200).json(cleanStatus);
   } catch (err) {
      next(err);
   }
};
