import express from 'express';
import * as validation from '../middleware/validation/authValidation.js';
import * as existance from '../middleware/existance/authExistance.js';
import * as controller from '../controllers/authController.js';

const router = express.Router();

router.post(
   '/login',
   validation.loginValidation,
   existance.loginExistance,
   controller.login
);
router.post(
   '/extend-login-state',
   validation.loginValidation,
   existance.loginExistance,
   controller.extendLoginState
);
router.post('/logout', controller.logout);

export default router;
