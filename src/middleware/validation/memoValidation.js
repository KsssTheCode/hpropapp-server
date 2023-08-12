import * as validation from '../../source/js/function/validation/commonValidationFn.js';

export const createMemoValidation = (req, res, next) => {
   try {
      const { memoTitle, memoContent, rsvnId, groupRsvnId, memberId, groupId } =
         req.body;

      switch (true) {
         case Boolean(rsvnId):
            validation.idCheck(rsvnId);
            break;
         case Boolean(groupRsvnId):
            validation.idCheck(groupRsvnId);
            break;
         case Boolean(memberId):
            validation.idCheck(memberId);
            break;
         case Boolean(groupId):
            validation.idCheck(groupId);
            break;
         default:
            throw createError(400, '메모 입력 대상 미입력');
      }

      if (!memoTitle || !memoContent)
         throw createError(400, '메모 제목, 내용 필수입력');
      if (memoTitle.length > 50)
         throw createError(400, '제목 한글 20자, 영문 60자 이내 작성');

      if (memoContent.length > 1500)
         throw createError(400, '내용 한글 500자, 영문 1500자 이내 작성');

      next();
   } catch (err) {
      next(err);
   }
};

export const getFollowingMemos = (req, res, next) => {
   try {
      const { rsvnId, groupRsvnId, memberId, groupId } = req.body;
      switch (true) {
         case Boolean(rsvnId):
            validation.idCheck(rsvnId);
            break;
         case Boolean(groupRsvnId):
            validation.idCheck(groupRsvnId);
            break;
         case Boolean(memberId):
            validation.idCheck(memberId);
            break;
         case Boolean(groupId):
            validation.idCheck(groupId);
            break;
         default:
            throw createError(400, '메모 입력 대상 미입력');
      }
      next();
   } catch (err) {
      next(err);
   }
};

export const editMemo = (req, res, next) => {
   try {
      const { newMemoTitle, newMemoContent, confirmYN } = req.body;

      if (newMemoTitle)
         if (newMemoTitle.length > 50)
            throw createError(400, '제목 한글 20자, 영문 60자 이내 작성');

      if (newMemoContent)
         if (newMemoContent.length > 1500)
            throw createError(400, '내용 한글 500자, 영문 1500자 이내 작성');

      if (confirmYN) validation.yesOrNoCheck(confirmYN, '메모확인여부');
      next();
   } catch (err) {
      next(err);
   }
};
