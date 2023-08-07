import { createError } from '../source/js/function/commonFn.js';
import jwt from 'jsonwebtoken';

export const authentication = (req, res, next) => {
   if (
      req.path === '/auth/login' ||
      req.path === '/rsvn/create-test-rsvns' ||
      req.path === '/group-rsvn/create-test-rsvns'
   )
      return next();
   if (!req.cookies?.access_token) {
      createError(401, '로그인이 필요합니다.');
   }

   const token = req.cookies?.access_token.replace('Bearer ', '');
   const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

   req.staffRole = decodedToken.role;
   next();
};
