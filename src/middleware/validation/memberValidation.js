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

export const checkMemberIdValidationOnly = (req, res, next) => {
   try {
      const { memberId } = req.query;
      validation.idCheck(id, '고객고유번호');
   } catch (err) {
      next(err);
   }
};

export const getMembersInFilterOptionsValidation = (req, res, next) => {
   try {
      const {
         blackListYN,
         adminYN,
         groupYN,
         membershipGrades,
         createStartDate,
         createEndDate,
         nationalities,
      } = req.query;
      if (blackListYN) validation.yesOrNoCheck(blackListYN);
      if (adminYN) validation.yesOrNoCheck(adminYN);
      if (groupYN) validation.yesOrNoCheck(groupYN);

      membershipGrades.split(',').forEach((grade) => {
         validation.membershipGradeCheck(grade);
      });
      // Array.isArray(membershipGrades)
      //    ? membershipGrades.forEach((grade) => {
      //         validation.membershipGradeCheck(grade);
      //      })
      //    : () => {
      //         throw createError(422, '멤버십등급 입력오류(Not an array)');
      //      };

      if (nationalities) {
         nationalities.split(',').forEach((nationCode) => {
            validation.nationalityCheck(nationCode);
         });
      }
      // Array.isArray(nationalities)
      //    ? nationalities.forEach((nationCode) => {
      //         validation.nationalityCheck(nationCode);
      //      })
      //    : () => {
      //         throw createError(422, '국가코드 입력오류(Not an array)');
      //      };

      const { adjustedStartDate, adjustedEndDate } =
         validation.dateSearchOptionsCheck(createStartDate, createEndDate);
      req.query.createStartDate = adjustedStartDate;
      req.query.createEndDate = adjustedEndDate;
      next();
   } catch (err) {
      next(err);
   }
};

// export const autoCompeletionWithNameValidation = (req, res, next) => {
//    try {
//       const { name } = req.body;
//       validation.specialCharacterCheck(name);
//       next();
//    } catch (err) {
//       next(err);
//    }
// };

export const editMemberValidation = (req, res, next) => {
   try {
      const {
         memberId,
         newName,
         newGender,
         newBirth,
         newTel,
         newNationality,
         newCarNumber,
         blackListYN,
         newMembershipGrade,
      } = req.body;

      validation.idCheck(memberId, '고객고유번호');
      if (newName) validation.nameCheck(newName);
      if (newTel) validation.telCheck(newTel);
      if (newGender) validation.genderCheck(newGender);
      if (newBirth) validation.birthCheck(newBirth);
      if (newNationality) validation.nationalityCheck(newNationality);
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
