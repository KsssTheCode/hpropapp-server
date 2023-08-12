import * as validation from '../../source/js/function/validation/commonValidationFn.js';

export const createGroupValidation = (req, res, next) => {
   try {
      const { groupName, representorName, representorTel, companyTel } =
         req.body;

      validation.groupNameCheck(groupName);
      validation.telCheck(representorTel);
      validation.nameCheck(representorName);
      if (companyName) validation.groupNameCheck(companyName);
      if (companyName && companyTel) validation.telCheck(companyTel);
      next();
   } catch (err) {
      next(err);
   }
};

export const getAllGroupsValidation = (req, res, next) => {
   try {
      const { page, itemsInOnePage } = req.body;
      page ? validation.numberCheck(page, '페이지') : (page = 1);
      itemsInOnePage
         ? validation.itemInOnePageCheck(itemsInOnePage)
         : (itemsInOnePage = 50);
      next();
   } catch (err) {
      next(err);
   }
};

export const getGroupInOptionsValidation = (req, res, next) => {
   try {
      const { page, itemsInOnePage, startDate, endDate } = req.body;
      page ? validation.numberCheck(page, '페이지') : (req.body.page = 1);
      itemsInOnePage
         ? validation.numberCheck(itemsInOnePage, '행 갯수')
         : (req.body.itemsInOnePage = 50);
      if (startDate) dateCheck(startDate);
      if (endDate) dateCheck(endDate);
      if (+startDate > +endDate)
         throw createError(400, '검색 시작일이 검색 종료일보다 늦을 수 없음');
      next();
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
