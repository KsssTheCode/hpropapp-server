import express from 'express';
import * as controller from '../controllers/groupController.js';
import * as validation from '../middleware/validation/groupValidation.js';
import * as existance from '../middleware/existance/groupExistance.js';

const router = express.Router();

router.post(
   '/create-group',
   validation.createGroupValidation,
   existance.createGroupExistance,
   controller.createGroup
);

router.get(
   '/get-groups-in-options',
   validation.getGroupInOptionsValidation,
   controller.getGroupsDataInFilterOptions
);

router.get(
   '/get-selected-group',
   existance.checkGroupExistanceOnly,
   controller.getSelectedGroup
);

router.post(
   '/edit-group',
   validation.editGroupValidation,
   existance.editGroupExistance,
   controller.editGroup
);

router.delete(
   '/delete-group',
   existance.checkGroupExistanceOnly,
   controller.deleteGroup
);

export default router;
