import * as deptDAO from '../data-access/departmentDAO.js';

export const createDeptService = async (bodyData) => {
   try {
      const { deptCode, deptName } = bodyData;
      return await deptDAO.createDeptDAO(deptCode, deptName);
   } catch (err) {
      throw err;
   }
};

export const getDeptsDataForFilterSelectionService = async (queryData) => {
   try {
      const { attributes } = queryData;
      if (attributes.length > 1) queryData.attributes = attributes.split(',');

      return await deptDAO.getDeptsDataForFilterSelectionDAO(queryData);
   } catch (err) {
      throw err;
   }
};

export const getSelectedDeptDataService = async (bodyData) => {
   try {
      const { deptCode } = bodyData;
      return await deptDAO.getSelectedDeptDataDAO(deptCode);
   } catch (err) {
      throw err;
   }
};

export const editDeptService = async (bodyData) => {
   try {
      const { deptCode, newDeptName, newDeptCode } = bodyData;
      return await deptDAO.editDeptDAO(deptCode, newDeptName, newDeptCode);
   } catch (err) {
      throw err;
   }
};

export const deleteDeptService = async (bodyData) => {
   try {
      const { deptCode } = bodyData;
      return await deptDAO.deleteDeptDAO(deptCode);
   } catch (err) {
      throw err;
   }
};
