import express from 'express';
import * as validation from '../middleware/validation/staffValidation.js';
import * as existance from '../middleware/existance/staffExistance.js';
import * as controller from '../controllers/staffController.js';

const router = express.Router();

router.post(
   '/create-staff',
   validation.createStaffValidation,
   existance.createStaffExistance,
   controller.createStaff
);

router.get(
   '/get-staffs-data-for-filter-selection',
   controller.getStaffsDataForFilterSelection
);

/* 추후 관리자 메뉴 생성 시 사용할 라우터*/
// router.get(
//    '/get-staff-change-history',
//    existance.checkStaffIdExistanceOnly,
//    controller.getStaffChangeHistory
// );

// router.get(
//    '/get-staffs-in-options',
//    validation.getStaffsInOptionsValidation,
//    existance.getStaffsInOptionsExistance,
//    controller.getStaffInOptions
// );

// router.get(
//    '/get-selected-staff',
//    existance.checkStaffIdExistanceOnly,
//    controller.getSelectedStaff
// );

// router.post(
//    '/edit-staff',
//    validation.editStaffValidation,
//    existance.editStaffExistance,
//    controller.editStaff
// );

// router.post(
//    '/edit-password',
//    validation.editPasswordValidation,
//    existance.checkExistingStaffOnlyAndStore,
//    controller.editPassword
// );

// router.post(
//    '/reset-password',
//    validation.staffIdOnlyValidation,
//    existance.checkStaffIdExistanceOnly,
//    controller.resetPassword
// );

// router.delete(
//    '/resign-staff',
//    validation.staffIdOnlyValidation,
//    existance.checkStaffIdExistanceOnly,
//    controller.resignStaff
// );

export default router;
