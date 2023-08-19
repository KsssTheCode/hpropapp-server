import * as validation from '../../source/js/function/validation/commonValidationFn.js';

export const createGroupValidation = (req, res, next) => {
   try {
      const { groupName, representorName, representorTel, companyTel } =
         req.body;

      validation.groupNameCheck(groupName);
      validation.telCheck(representorTel);

      if (representorName) validation.nameCheck(representorName);
      if (companyName) validation.groupNameCheck(companyName);
      if (companyTel) validation.telCheck(companyTel);
      next();
   } catch (err) {
      next(err);
   }
};

export const getGroupInOptionsValidation = (req, res, next) => {
   try {
      const { startDate, endDate } = req.query;

      const { adjustedStartDate, adjustedEndDate } =
         validation.dateSearchOptionsCheck(startDate, endDate);
      req.query.startDate = adjustedStartDate;
      req.query.endDate = adjustedEndDate;

      next();
   } catch (err) {
      next(err);
   }
};

export const checkGroupIdValidationOnly = (req, res, next) => {
   try {
      const { groupId } = req.body;
      validation.idCheck(groupId, '그룹고유번호');
   } catch (err) {
      next(err);
   }
};

export const editGroupValidation = (req, res, next) => {
   try {
      const {
         newGroupName,
         newRepresentorName,
         newRepresentorTel,
         newCompanyName,
         newCompanyTel,
      } = req.body;
      if (newRepresentorName) validation.nameCheck(newRepresentorName);
      if (newRepresentorTel) validation.telCheck(newRepresentorTel);
      if (newGroupName) validation.groupNameCheck(newGroupName);
      if (newCompanyName) validation.groupNameCheck(newCompanyName);
      if (newCompanyName && newCompanyTel) validation.telCheck(newCompanyTel);

      next();
   } catch (err) {
      next(err);
   }
};
