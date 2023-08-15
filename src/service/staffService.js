import * as staffDAO from '../data-access/staffDAO.js';
import { createId } from '../source/js/function/commonFn.js';
import * as staffFn from '../source/js/function/staffFn.js';

export const createStaffService = async (bodyData) => {
   try {
      const { name, gender, birth, tel, address, enrollDate, deptCode } =
         bodyData;
      let staffId = await createId('staff');
      const hashedPassword = staffFn.createHashedPassword('Password!');
      const createData = {
         staffId,
         password: hashedPassword,
         name,
         gender,
         birth,
         tel,
         address,
         enrollDate,
         role: 'MANAGER',
         deptCode,
      };

      return await staffDAO.createStaffDAO(createData);
   } catch (err) {
      throw err;
   }
};

export const getStaffsDataForFilterSelectionService = async () => {
   try {
      return await staffDAO.getStaffsDataForFilterSelectionDAO();
   } catch (err) {
      throw err;
   }
};
