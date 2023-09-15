import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';

const Membership = db.Membership;

export const createMembershipDAO = async (createData) => {
   try {
      return await Membership.create(createData).catch(() => {
         throw createError(500, '멤버십 생성 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const getMembershipsDataForFilterSelectionDAO = async () => {
   try {
      return await Membership.findAll({
         attributes: ['membershipName'],
      }).catch(() => {
         throw createError(500, '멤버십 조회 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const getSelectedMembershipDAO = async (membershipGrade) => {
   try {
      await Membership.findByPk(membershipGrade).catch(() => {
         throw createError(500, '멤버십 조회 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const editMembershipDAO = async (
   membershipGrade,
   newMembershipGrade,
   newMembershipName,
   newDiscount,
   newReference
) => {
   try {
      return await Membership.update(
         {
            ...(newMembershipGrade && { membershipGrade: newMembershipGrade }),
            ...(newMembershipName && { membershipName: newMembershipName }),
            ...(newDiscount && { discount: newDiscount }),
            ...(newReference && { reference: newReference }),
         },
         {
            where: { membershipGrade },
         }
      ).catch(() => {
         throw createError(500, '멤버십 등급 삭제 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const deleteMembershipDAO = async (membershipGrade) => {
   try {
      return await Membership.destroy({
         where: { membershipGrade },
      }).catch(() => {
         throw createError(500, '멤버십 등급 삭제 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};
