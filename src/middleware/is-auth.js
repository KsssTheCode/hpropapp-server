import { createError } from '../source/js/function/commonFn.js';
import jwt from 'jsonwebtoken';

export const authentication = (req, res, next) => {
   try {
      if (
         req.path === '/auth/login' ||
         req.path === '/rsvn/create-test-rsvns' ||
         req.path === '/group-rsvn/create-test-rsvns'
      ) {
         next();
      } else {
         if (!req.cookies?.access_token) {
            createError(403, '해당기능 접근 권한 없음');
         } else {
            const token = req.cookies?.access_token.replace('Bearer ', '');
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            req.staffRole = decodedToken.role;
         }
         next();
      }
   } catch (err) {
      next(err);
   }
};
