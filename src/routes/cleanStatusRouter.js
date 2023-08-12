import express from 'express';
import * as controller from '../controllers/cleanStatusController.js';
import * as existance from '../middleware/existance/cleanStatusExistance.js';

const router = express.Router();

router.post(
   '/create-clean-status',
   existance.createCleanStatus,
   controller.createCleanStatus
);
router.delete(
   '/delete-clean-status',
   existance.deleteCleanStatus,
   controller.deleteCleanStatus
);

router.get('/get-clean-statuses', controller.getCleanStatuses);

export default router;
