import * as existance from '../../source/js/function/existance/existanceFn.js';

export const createAndGetFollowingMemosExistance = async (req, res, next) => {
   try {
      const { rsvnId, groupRsvnId, memberId, groupId } = req.body;

      switch (true) {
         case Boolean(rsvnId):
            const isExistingRsvn = existance.checkExistingRsvn(rsvnId);
            if (!isExistingRsvn) throw createError(400, '존재하지 않는 예약');
            break;
         case Boolean(groupRsvnId):
            const isExistingGroupRsvn =
               existance.checkExistingGroupRsvn(groupRsvnId);
            if (!isExistingGroupRsvn)
               throw createError(400, '존재하지 않는 단체예약');
            break;
         case Boolean(memberId):
            const isExistingMember = existance.checkExistingMember(memberId);
            if (!isExistingMember) throw createError(400, '존재하지 않는 회원');
            break;
         case Boolean(groupId):
            const isExistingGroup = existance.checkExistingGroup(groupId);
            if (!isExistingGroup) throw createError(400, '존재하지 않는 단체');
            break;
         default:
            throw createError(400, '메모 입력 대상 미입력');
      }

      next();
   } catch (err) {
      next(err);
   }
};

export const checkMemoExistanceOnly = async (req, res, next) => {
   try {
      const { memoId } = req.body;
      const isExistingMemo = existance.checkExistingMemo(memoId);
      if (!isExistingMemo) throw createError(400, '존재하지 않는 메모');
      next();
   } catch (err) {
      next(err);
   }
};

export const checkMemoExistanceAndStore = async (req, res, next) => {
   try {
      const { memoId } = req.body;
      const isExistingMemo = existance.checkExistingMemo(memoId);
      isExistingMemo
         ? (req.body.memoData = isExistingMemo)
         : () => {
              throw createError(400, '존재하지 않는 메모');
           };
      next();
   } catch (err) {
      next(err);
   }
};
