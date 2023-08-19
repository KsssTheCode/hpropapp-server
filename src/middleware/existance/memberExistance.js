import * as existance from '../../source/js/function/existance/existanceFn.js';
import { createError } from '../../source/js/function/commonFn.js';

export const createMemberExistance = async (req, res, next) => {
   try {
      const { nationality, tel } = req.body;

      if (nationality) existance.checkExistingNation(nationality);

      const isDuplicateTel = await existance.checkExistingTel(tel);
      if (isDuplicateTel) throw createError(400, '이미 가입된 고객의 연락처');
      next();
   } catch (err) {
      next(err);
   }
};

export const editMemberExistance = async (req, res, next) => {
   try {
      const { newNationality, memberId, newMembershipGrade } = req.body;
      const isExistingMember = await existance.checkExistingMember(memberId);
      if (!isExistingMember) throw createError(400, '존재하지 않는 고객');

      if (newNationality) existance.checkExistingNation(newNationality);
      if (newMembershipGrade) {
         const isExistingGrade = await existance.checkExistingMembershipGrade(
            newMembershipGrade
         );
         if (!isExistingGrade)
            throw createError(400, '존재하지 않는 멤버십등급');
      }
      next();
   } catch (err) {
      next(err);
   }
};

export const getMembersInFilterOptionsExistance = async (req, res, next) => {
   try {
      const { membershipGrades, nationalities } = req.body;

      if (membershipGrades)
         for await (let grade of membershipGrades) {
            const isExistingGrade =
               existance.checkExistingMembershipGrade(grade);
            if (!isExistingGrade)
               throw createError(404, '존재하지 않는 멤버십등급');
         }
      if (nationalities)
         for await (let nationCode of nationalities) {
            const isExistingCode = existance.checkExistingNation(nationCode);
            if (!isExistingCode)
               throw createError(404, '존재하지 않는 국가코드');
         }
      next();
   } catch (err) {
      next(err);
   }
};

export const checkMemberExistanceOnly = async (req, res, next) => {
   try {
      const { memberId } = req.body;
      const isExistingMemberId = await existance.checkExistingMember(memberId);
      if (!isExistingMemberId) throw createError(404, '존재하지 않는 고객');
      next();
   } catch (err) {
      next(err);
   }
};
