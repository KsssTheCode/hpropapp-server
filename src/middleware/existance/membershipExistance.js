import * as existance from '../../source/js/function/existance/existanceFn.js';

export const createMembershipExistance = async (req, res, next) => {
   try {
      const { membershipGrade } = req.body;
      const isDuplicateGrade = await existance.checkExistingMembershipGrade(
         membershipGrade
      );
      if (isDuplicateGrade) throw createError(400, '이미 존재하는 멤버십등급');
      next();
   } catch (err) {
      next(err);
   }
};

export const checkMembershipExistanceOnly = async (req, res, next) => {
   try {
      const { membershipGrade } = req.body;
      const isExistingGrade = await existance.checkExistingMembershipGrade(
         membershipGrade
      );
      if (!isExistingGrade) throw createError(400, '존재하지 않는 멤버십등급');
      next();
   } catch (err) {
      next(err);
   }
};

export const editMembershipExistance = async (req, res, next) => {
   try {
      const { membershipGrade, newMembershipGrade } = req.body;
      const isExistingGrade = await existance.checkExistingMembershipGrade(
         membershipGrade
      );
      if (!isExistingGrade) throw createError(400, '존재하지 않는 멤버십등급');
      const isDuplicateGrade = await existance.checkExistingMembershipGrade(
         newMembershipGrade
      );
      if (isDuplicateGrade)
         throw createError(400, '이미 존재하는 멤버십등급(변경할 등급)');
      next();
   } catch (err) {
      next(err);
   }
};
