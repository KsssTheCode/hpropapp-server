import express from 'express';
import * as controller from '../controllers/departmentController.js';
import * as validation from '../middleware/validation/departmentValidation.js';
import * as existance from '../middleware/existance/departmentExistance.js';

const router = express.Router();

router.post(
   '/create-dept',
   validation.departmentCodeValidationOnly,
   existance.createDepartmentCodeExistance,
   controller.createDept
);

router.get(
   'get-depts-data-for-filter-selection',
   controller.getDeptsDataForFilterSelection
);

router.get(
   '/get-selected-depts',
   validation.departmentCodeValidationOnly,
   existance.departmentCodeExistanceOnly,
   controller.getSelectedDeptData
);

router.post(
   '/edit-dept',
   validation.editDepartmentValidation,
   existance.editDepartmentExistance,
   controller.editDept
);

router.delete(
   '/delete-dept',
   validation.departmentCodeValidationOnly,
   existance.departmentCodeExistanceOnly,
   controller.deleteDept
);

export default router;
