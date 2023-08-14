import express from 'express';
import * as controller from '../controllers/departmentController.js';
import * as validation from '../middleware/validation/departmentValidation.js';
import * as existance from '../middleware/existance/departmentExistance.js';

const router = express.Router();

router.post(
   '/create-dept',
   validation.departmentCodeValidationOnly,
   existance.createDepartmentCodeExistance,
   controller.createDepartment
);

router.get('get-depts-in-options', controller.getDepartmentsInOptions);

router.get(
   '/get-selected-depts',
   validation.departmentCodeValidationOnly,
   existance.departmentCodeExistanceOnly,
   controller.getSelectedDepartment
);

router.post(
   '/edit-dept',
   validation.editDepartmentValidation,
   existance.editDepartmentExistance,
   controller.editDepertment
);

router.delete(
   '/delete-dept',
   validation.departmentCodeValidationOnly,
   existance.departmentCodeExistanceOnly,
   controller.deleteDepartment
);

export default router;
