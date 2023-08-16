import * as membershipDAO from '../data-access/membershipDAO.js';

export const createMembershipService = async (bodyData) => {
   try {
      const { membershipGrade, membershipName, discount, reference } = bodyData;

      const createData = {
         membershipGrade,
         membershipName,
         discount,
         reference,
      };
      return await membershipDAO.createMembershipDAO(createData);
   } catch (err) {
      throw err;
   }
};

export const getMembershipsDataForFilterSelectionService = async () => {
   try {
      return await membershipDAO.getMembershipsDataForFilterSelectionDAO();
   } catch (err) {
      throw err;
   }
};

export const getSelectedMembershipService = async (bodyData) => {
   try {
      const { membershipGrade } = bodyData;
      return await membershipDAO.getSelectedMembershipDAO(membershipGrade);
   } catch (err) {
      throw err;
   }
};

export const editMembershipService = async (bodyData) => {
   try {
      const {
         membershipGrade,
         newMembershipGrade,
         newMembershipName,
         newDiscount,
         newReference,
      } = bodyData;

      return await membershipDAO.editMembershipDAO(
         membershipGrade,
         newMembershipGrade,
         newMembershipName,
         newDiscount,
         newReference
      );
   } catch (err) {
      throw err;
   }
};

export const deleteMembershipService = async (bodyData) => {
   try {
      const { membershipGrade } = bodyData;
      return await membershipDAO.deleteMembershipDAO(membershipGrade);
   } catch (err) {
      throw err;
   }
};
