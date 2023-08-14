import * as deptDAO from '../data-access/departmentDAO';

export const createDepartmentService = async () => {
   try {
      const { deptCode, deptName } = bodyData;
      return await deptDAO.createDepartmentDAO(deptCode, deptName);
   } catch (err) {
      throw err;
   }
};

export const getDepartmentsInOptionsService = async (queryData) => {
   try {
      const { attributes, searchOptions } = bodyData;

      let attributesArr = null;
      if (attributes) attributesArr = attributes.split(',');

      let searchOptionsArr = null;
      if (searchOptions) searchOptionsArr = searchOptions;

      return await deptDAO.getDepartmentsInOptionsDAO(
         attributesArr,
         searchOptionsArr
      );
   } catch (err) {
      throw err;
   }
};

export const getSelectedDepartmentService = async (bodyData) => {
   try {
      const { deptCode } = bodyData;
      return await deptDAO.getSelectedDepartmentDAO(deptCode);
   } catch (err) {
      throw err;
   }
};

export const editDepartmentService = async (bodyData) => {
   try {
      const { deptCode, newDeptName, newDeptCode } = bodyData;
      return await deptDAO.editDepartmentDAO(
         deptCode,
         newDeptName,
         newDeptCode
      );
   } catch (err) {
      throw err;
   }
};

export const deleteDepartmentService = async (bodyData) => {
   try {
      const { deptCode } = bodyData;
      return await deptDAO.deleteDepartmentDAO(deptCode);
   } catch (err) {
      throw err;
   }
};
