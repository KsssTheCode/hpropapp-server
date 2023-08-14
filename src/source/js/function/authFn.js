import { createError } from './commonFn.js';
import bcrypt from 'bcrypt';

export function checkPassword(staff, password, errorMessage) {
   if (!bcrypt.compareSync(password, staff.password))
      throw createError(400, errorMessage);
}
