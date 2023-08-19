import db from '../models/index.js';
import * as memberDAO from '../data-access/memberDAO.js';
import { createId } from '../source/js/function/commonFn.js';

export const createMemberService = async (bodyData) => {
   try {
      const {
         name,
         gender,
         birth,
         tel,
         address,
         nationality,
         carNumber,
         blackListYN,
         reference,
         membershipGrade,
      } = bodyData;

      let memberId = 'M' + (await createId('Member'));

      const createData = {
         memberId,
         name,
         gender,
         birth,
         tel,
         address,
         nationality,
         carNumber,
         blackListYN,
         reference,
         membershipGrade,
      };

      return await memberDAO.createMemberDAO(createData);
   } catch (err) {
      throw err;
   }
};

export const getAllMembersService = async () => {
   try {
      return await memberDAO.getAllMembersDAO();
   } catch (err) {
      throw err;
   }
};

export const getSelectedMemberDataService = async (queryData) => {
   try {
      const { memberId } = queryData;
      return await memberDAO.getSelectedMemberDataDAO(memberId);
   } catch (err) {
      throw err;
   }
};

export const getMembersInFilterOptionsService = async (queryData) => {
   try {
      const {
         keyword,
         blackListYN,
         membershipGrades,
         createStartDate, //생성일
         createEndDate, // 생성일
         nationalities,
      } = queryData;

      return await memberDAO.getMembersDataInFilterOptionsDAO(
         keyword,
         blackListYN,
         membershipGrades,
         createStartDate,
         createEndDate,
         nationalities
      );
   } catch (err) {
      throw err;
   }
};

export const editMemberService = async (bodyData) => {
   const transaction = db.sequelize.transaction();
   try {
      const {
         memberId,
         newName,
         newGender,
         newBirth,
         newTel,
         newAddress,
         newNationality,
         newCarNumber,
         blackListYN,
         newMembershipGrade,
         newReference,
      } = bodyData;

      const updateData = {
         ...(newName && { name: newName }),
         ...(newGender && { gender: newGender }),
         ...(newBirth && { birth: newBirth }),
         ...(newTel && { tel: newTel }),
         ...(newAddress && { address: newAddress }),
         ...(newNationality && { nationality: newNationality }),
         ...(newCarNumber && { carNumber: newCarNumber }),
         ...(blackListYN && { blackListYN }),
         ...(newMembershipGrade && { membershipGrade: newMembershipGrade }),
         ...(newReference && { reference: newReference }),
      };

      const editedMemberData = await memberDAO.editMemberDAO(
         memberId,
         staffId,
         updateData,
         transaction
      );

      transaction.commit();
      return editedMemberData;
   } catch (err) {
      transaction.rollback();
      throw err;
   }
};

export const deleteMemberService = async (bodyData) => {
   try {
      const { memberId } = bodyData;
      return await memberDAO.deleteMemberDAO(memberId);
   } catch (err) {
      throw err;
   }
};
