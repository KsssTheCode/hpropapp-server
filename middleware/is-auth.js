import { createError } from '../source/js/function/commonFn.js';
import jwt from 'jsonwebtoken';

export const authentication = (req, res, next) => {
   console.log(req.path);
   if (req.path === '/auth/login') return next();
   if (!req.cookies?.access_token) createError(401, '접근 권한이 없습니다');

   const token = req.cookies?.access_token.replace('Bearer ', '');
   const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

   req.staffRole = decodedToken.role;
   next();
};
