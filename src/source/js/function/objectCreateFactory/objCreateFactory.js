import { createId } from '../commonFn';
import { createHashedPassword } from '../staffFn';

export const staffFactory = async (
   password,
   name,
   gender,
   birth,
   tel,
   address,
   enrollDate,
   deptCode
) => ({
   return {
      staffId: await createId('staff'),
      password: createHashedPassword(password),
      name,
      gender,
      birth,
      tel,
      address,
      enrollDate,
      deptCode,
   };
});
