import * as validation from '../../source/js/function/validation/commonValidationFn.js';

export const departmentCodeValidationOnly = (req, res, next) => {
   try {
      const { deptCode } = req.body;
      validation.departmentCodeCheck(deptCode);
      next();
   } catch (err) {
      next(err);
   }
};

export const editDepartmentValidation = (req, res, next) => {
   try {
      const { deptCode, newDeptCode } = req.body;
      validation.departmentCodeCheck(deptCode);
      if (newDeptCode) validation.departmentCodeCheck(newDeptCode);
      next();
   } catch (err) {
      next(err);
   }
};
