import * as existance from '../../source/js/function/existance/existanceFn.js';
import { createError } from '../../source/js/function/commonFn.js';

export const createDepartmentCodeExistance = async (req, res, next) => {
   try {
      const { deptCode } = req.body;
      const isExistingDeptCode = await existance.checkExistingDeptCode(
         deptCode
      );
      if (isExistingDeptCode) throw createError(400, '이미 존재하는 부서코드');

      next();
   } catch (err) {
      next(err);
   }
};

export const departmentCodeExistanceOnly = async (req, res, next) => {
   try {
      const { deptCode } = req.body;
      const isExistingDeptCode = await existance.checkExistingDeptCode(
         deptCode
      );
      if (!isExistingDeptCode) throw createError(400, '존재하지 않는 부서코드');
      next();
   } catch (err) {
      next(err);
   }
};

export const editDepartmentExistance = async (req, res, next) => {
   try {
      const { deptCode, newDeptCode } = req.body;
      const isExistingDeptCode = await existance.checkExistingDeptCode(
         deptCode
      );
      if (!isExistingDeptCode) throw createError(400, '존재하지 않는 부서코드');

      if (newDeptCode) {
         const isDuplicateDeptCode = await existance.checkExistingDeptCode(
            newDeptCode
         );
         if (isDuplicateDeptCode)
            throw createError(400, '이미 존재하는 부서코드(변경할 코드)');
      }
      next();
   } catch (err) {
      next(err);
   }
};
