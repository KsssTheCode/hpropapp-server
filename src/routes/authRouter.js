import express from 'express';
import * as validation from '../middleware/validation/authValidation.js';
import * as controller from '../controllers/authController.js';

const router = express.Router();

router.post('/login', validation.loginValidation, controller.login);
router.post(
   '/extend-login-state',
   validation.loginValidation,
   controller.extendLoginState
);
router.post('/logout', controller.logout);

export default router;
