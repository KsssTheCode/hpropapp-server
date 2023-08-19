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
      const { deptCode, newDeptCode, newDeptName } = req.body;
      validation.departmentCodeCheck(deptCode);
      if (!newDeptCode && !newDeptName)
         throw createError(422, '변경할 내용이 입력되지 않았습니다.');
      if (newDeptCode) validation.departmentCodeCheck(newDeptCode);
      next();
   } catch (err) {
      next(err);
   }
};
