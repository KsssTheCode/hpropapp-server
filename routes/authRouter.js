import express from 'express';
import * as validation from '../middleware/validation/authValidation.js';
import * as existance from '../middleware/existance/authExistance.js';
import * as controller from '../controllers/authController.js';

const router = express.Router();

router.post(
   '/create-staff',
   validation.createStaffValidation,
   existance.createStaffExistance,
   controller.createStaff
);

// router.get(
//    '/get-staff-change-history',
//    existance.checkStaffIdExistanceOnly,
//    controller.getStaffChangeHistory
// );

router.get('/get-all-staffs', controller.getAllStaffs);

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

router.post('/login', validation.loginValidation, controller.login);
router.post('/logout', controller.logout);

// router.delete(
//    '/resign-staff',
//    validation.staffIdOnlyValidation,
//    existance.checkStaffIdExistanceOnly,
//    controller.resignStaff
// );

export default router;
