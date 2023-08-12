import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';

const Memo = db.Memo;

export const createMemo = async (req, res, next) => {
   try {
      const { memoTitle, memoContent, rsvnId, groupRsvnId, memberId, groupId } =
         req.body;

      let createData = { memoTitle, memoContent, confirmYN: 'N' };
      switch (true) {
         case Boolean(rsvnId):
            createData.rsvnId = rsvnId;
            break;
         case Boolean(groupRsvnId):
            createData.groupRsvnId = groupRsvnId;
            break;
         case Boolean(memberId):
            createData.memberId = memberId;
            break;
         case Boolean(groupId):
            createData.groupId = groupId;
            break;
      }

      await Memo.create(createData).catch(() => {
         throw createError(500, '메모 생성 중 DB에서 오류발생');
      });

      res.status(200).send('메모생성 성공');
   } catch (err) {
      next(err);
   }
};

export const getSelectedMemo = async (req, res, next) => {
   try {
      const { memoData } = req.body;
      res.status(200).json(memoData);
   } catch (err) {
      next(err);
   }
};

export const getFollowingMemos = async (req, res, next) => {
   try {
      const { rsvnId, groupRsvnId, memberId, groupId } = req.body;

      let whereCondition = {};
      switch (true) {
         case Boolean(rsvnId):
            whereCondition.rsvnId = rsvnId;
            break;
         case Boolean(groupRsvnId):
            whereCondition.groupRsvnId = groupRsvnId;
            break;
         case Boolean(memberId):
            whereCondition.memberId = memberId;
            break;
         case Boolean(groupId):
            whereCondition.groupId = groupId;
            break;
      }

      const memoDatas = await Memo.findAll({
         where: whereCondition,
         returning: true,
      }).catch(() => {
         throw createError(500, '메모 호출 중 DB에서 오류발생');
      });

      res.status(200).json(memoDatas);
   } catch (err) {
      next(err);
   }
};

export const editMemo = async (req, res, next) => {
   const transaction = db.sequelize.transaction();
   try {
      const { memoId, newMemoTitle, newMemoContent, confirmYN } = req.body;

      await Memo.update(
         {
            memoTitle: newMemoTitle,
            memoContent: newMemoContent,
            confirmYN: confirmYN,
         },
         { where: { memoId: memoId }, transaction: transaction }
      ).catch(() => {
         throw createError(500, '메모 수정 중 DB에서 오류발생');
      });

      transaction.commit();
      res.status(200).send('메모수정 성공');
   } catch (err) {
      transaction.rollback();
      next(err);
   }
};

export const deleteMemo = async (req, res, next) => {
   try {
      const { memoId } = req.body;
      await Memo.destroy({ where: { memoId: memoId } }).catch(() => {
         throw createError(500, '메모 삭제 중 DB에서 오류발생');
      });
      res.status(200).send('메모삭제 완료');
   } catch (err) {
      next(err);
   }
};
