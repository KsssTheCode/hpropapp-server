import db from '../models/index.js';

import {
   getChangeHistoryMessage,
   createId,
} from '../source/js/function/commonFn.js';
import * as groupDAO from '../data-access/groupDAO.js';

export const createGroupService = async (bodyData) => {
   try {
      const {
         groupName,
         representorName,
         representorTel,
         companyName,
         companyTel,
         companyAddress,
         reference,
      } = bodyData;

      const groupId = 'G' + createId('group');

      const createData = {
         groupId,
         groupName,
         representorName,
         representorTel,
         companyName,
         companyTel,
         companyAddress,
         reference,
      };
      return await groupDAO.createGroupDAO(createData);
   } catch (err) {
      throw err;
   }
};

export const getGroupsDataInFilterOptionsService = async (bodyData) => {
   try {
      const { keyword, startDate, endDate } = bodyData;
      return groupDAO.getAllGroupsDataDAO(keyword, startDate, endDate);
   } catch (err) {
      throw err;
   }
};

export const getSelectedGroupService = async (bodyData) => {
   try {
      const { groupId } = bodyData;
      return await groupDAO.getSelectedGroupDAO(groupId);
   } catch (err) {
      throw err;
   }
};

export const editGroupService = async (bodyData, staffId) => {
   const transaction = db.sequelize.transaction();
   try {
      const {
         groupId,
         newGroupName,
         newRepresentorName,
         newRepresentorTel,
         newCompanyName,
         newCompanyTel,
         newReference,
      } = bodyData;

      const updateData = {
         ...(groupNamegroupName && { groupName: newGroupName }),
         ...(newRepresentorName && { representorName: newRepresentorName }),
         ...(newRepresentorTel && { representorTel: newRepresentorTel }),
         ...(newCompanyName && { companyName: newCompanyName }),
         ...(newCompanyTel && { companyTel: newCompanyTel }),
         ...(newCompanyAddress && { companyAddress: newCompanyAddress }),
         ...(newReference && { reference: newReference }),
      };
      const updatedData = await groupDAO.editGroupDAO({
         groupId,
         staffId,
         updateData,
         transaction,
      });
      await transaction.commit();
      return updatedData;
   } catch (err) {
      await transaction.rollback();
      throw err;
   }
};

export const deleteGroupService = async (bodyData) => {
   try {
      const { groupId } = bodyData;
      return await groupDAO.deleteGroupDAO(groupId);
   } catch (err) {
      throw err;
   }
};
