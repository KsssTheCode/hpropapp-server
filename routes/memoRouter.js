import express from 'express';
import * as controller from '../controllers/memoController.js';
import * as validation from '../middleware/validation/memoValidation.js';
import * as existance from '../middleware/existance/memoExistance.js';

const router = express.Router();

router.post(
   '/create-memo',
   validation.createMemoValidation,
   existance.createAndGetFollowingMemosExistance,
   controller.createMemo
);

router.get(
   '/get-selected-memo',
   existance.checkMemoExistanceOnly,
   controller.getSelectedMemo
);

router.get(
   '/get-following-memos',
   validation.getFollowingMemos,
   existance.createAndGetFollowingMemosExistance,
   controller.getFollowingMemos
);

router.post(
   '/edit-memo',
   validation.editMemo,
   existance.checkMemoExistanceOnly,
   controller.editMemo
);

router.delete(
   'delete-memo',
   existance.checkMemoExistanceOnly,
   controller.deleteMemo
);

export default router;
