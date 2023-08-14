export function createHashedPassword(password) {
   const salt = bcrypt.genSaltSync(10);
   return bcrypt.hashSync(password, salt);
}
