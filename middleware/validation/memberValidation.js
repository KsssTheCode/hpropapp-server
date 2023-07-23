import { createError } from '../../source/js/function/commonFn.js';
import * as validation from '../../source/js/function/validation/commonValidationFn.js';

export const createMemberValidation = (req, res, next) => {
   try {
      const { name, gender, birth, tel, nationality, carNumber, blackListYN } =
         req.body;
      validation.nameCheck(name);
      validation.telCheck(tel);

      if (gender) validation.genderCheck(gender);

      if (birth) validation.birthCheck(birth);
      if (nationality) validation.nationalityCheck(nationality);

      if (carNumber) validation.carNumberCheck(carNumber);
      if (blackListYN) validation.yesOrNoCheck(blackListYN);
      next();
   } catch (err) {
      next(err);
   }
};

export const getAllMembersValdiation = (req, res, next) => {
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

export const getMembersInOptionsValidation = (req, res, next) => {
   try {
      const {
         page,
         itemsInOnePage,
         blackListYN,
         adminYN,
         groupYN,
         membershipGrades,
         startDate,
         endDate,
         nationalities,
      } = req.body;
      page ? validation.numberCheck(page, '페이지') : (page = 1);
      itemsInOnePage
         ? validation.itemInOnePageCheck(itemsInOnePage)
         : (itemsInOnePage = 50);
      if (blackListYN) validation.yesOrNoCheck(blackListYN);
      if (adminYN) validation.yesOrNoCheck(adminYN);
      if (groupYN) validation.yesOrNoCheck(groupYN);
      Array.isArray(membershipGrades)
         ? membershipGrades.forEach((grade) => {
              validation.membershipGradeCheck(grade);
           })
         : () => {
              throw createError(400, '멤버십등급 입력오류(배열이 아님)');
           };
      Array.isArray(nationalities)
         ? nationalities.forEach((nationCode) => {
              memberValidation.nationalityCheck(nationCode);
           })
         : () => {
              throw createError(400, '국가코드 입력오류(배열이 아님)');
           };
      if (startDate) dateCheck(startDate);
      if (endDate) dateCheck(endDate);
      if (+startDate > +endDate)
         throw createError(400, '검색 시작일이 검색 종료일보다 늦을 수 없음');
      next();
   } catch (err) {
      next(err);
   }
};

export const autoCompeletionWithNameValidation = (req, res, next) => {
   try {
      const { name } = req.body;
      validation.specialCharacterCheck(name);
      next();
   } catch (err) {
      next(err);
   }
};

export const editMemberValidation = (req, res, next) => {
   try {
      const {
         newName,
         newGender,
         newBirth,
         newTel,
         newNationality,
         newCarNumber,
         blackListYN,
         newMembershipGrade,
      } = req.body;
      validation.nameCheck(newName);

      if (newTel) validation.telCheck(newTel);
      if (newGender) validation.genderCheck(newGender);
      if (newBirth) validation.birthCheck(newBirth);
      if (newNationality) memberValidation.nationCheck(newNationality);
      if (newCarNumber) validation.carNumberCheck(newCarNumber);
      if (!blackListYN) throw createError(400, '블랙리스트 여부 미입력');
      validation.yesOrNoCheck(blackListYN);

      if (newMembershipGrade)
         validation.membershipGradeCheck(newMembershipGrade);
      next();
   } catch (err) {
      next(err);
   }
};
