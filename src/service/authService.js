import bcrypt from 'bcrypt';

import * as authDAO from '../data-access/authDAO.js';
import { createError } from '../source/js/function/commonFn.js';

export const logInService = async (staffId, password) => {
   try {
      const response = await authDAO.logInDAO(staffId);

      if (!response) createError(400, '로그인 실패');

      if (!bcrypt.compareSync(password, response.password)) {
         createError(401, '비밀번호 불일치');
      }

      return response;
   } catch (err) {
      throw err;
   }
};
