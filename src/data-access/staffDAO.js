import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';

const Staff = db.Staff;

export const createStaffDAO = async (createData) => {
   try {
      return await Staff.create(createData).catch(() => {
         throw createError(500, '직원생성 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const getStaffsInOptionsDAO = async () => {
   try {
      return await Staff.findAll(
         { attributes: ['name', 'staffId'] },
         {
            where: { leaveDate: null },
            include: {
               model: db.Department,
               attributes: ['deptName'],
            },
            order: [['createdAt', 'desc']],
         }
      ).catch(() => {
         throw createError(500, '직원 검색 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};
