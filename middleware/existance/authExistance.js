import { createError } from '../../source/js/function/commonFn.js';
import * as existance from '../../source/js/function/existance/existanceFn.js';

export const createStaffExistance = async (req, res, next) => {
   try {
      const { deptCode } = req.body;
      const isExistingDept = await existance.checkExistingDeptCode(deptCode);
      if (!isExistingDept) throw createError(400, '존재하지 않는 부서');
      next();
   } catch (err) {
      next(err);
   }
};

export const getStaffsInOptionsExistance = async (req, res, next) => {
   try {
      const { page, itemsInOnePage, deptCodes } = req.body;
      if (deptCodes)
         for await (let code of deptCodes) {
            const isExistingCode = existance.checkExistingMembershipGrade(code);
            if (!isExistingCode)
               throw createError(400, '존재하지 않는 부서코드');
         }

      if (page > 1) existance.checkAvailablePage(page, itemsInOnePage);
      next();
   } catch (err) {
      next(err);
   }
};

export const checkStaffIdExistanceOnly = async (req, res, next) => {
   try {
      const { staffId } = req.body;
      const isExistingStaff = await existance.checkExistingStaff(staffId);
      if (!isExistingStaff) throw createError(400, '존재하지 않는 직원');
      next();
   } catch (err) {
      next(err);
   }
};

export const editStaffExistance = async (req, res, next) => {
   try {
      const { newDeptCode, staffId } = req.body;
      const isExistingDept = await existance.checkExistingDeptCode(newDeptCode);
      if (!isExistingDept) throw createError(400, '존재하지 않는 부서');
      const isExistingStaff = await existance.checkExistingStaff(staffId);
      if (!isExistingStaff) throw createError(400, '존재하지 않는 직원');
      next();
   } catch (err) {
      next(err);
   }
};

export const checkExistingStaffOnlyAndStore = async (req, res, next) => {
   try {
      const { staffId } = req.body;
      const isExistingStaff = await existance.checkExistingStaff(staffId);
      isExistingStaff
         ? (req.body.existingStaff = isExistingStaff)
         : () => {
              throw createError(400, '존재하지 않는 직원');
           };

      next();
   } catch (err) {
      next(err);
   }
};
