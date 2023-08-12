import { createError } from './commonFn.js';
import bcrypt from 'bcrypt';

export function checkPassword(staff, password, errorMessage) {
   if (!bcrypt.compareSync(password, staff.password))
      throw createError(400, errorMessage);
}

export function createHashedPassword(password) {
   const salt = bcrypt.genSaltSync(10);
   return bcrypt.hashSync(password, salt);
}
