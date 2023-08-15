import { Op } from 'sequelize';
import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';

const Dept = db.Department;

export const createDeptDAO = async (deptCode, deptName) => {
   try {
      return await Department.create({
         deptCode,
         deptName,
      }).catch(() => {
         throw createError(500, '부서생성 중 DB에서 오류 발생');
      });
   } catch (err) {
      throw err;
   }
};

export const getDeptsDataForFilterSelectionDAO = async () => {
   try {
      return await Dept.findAll({ attributes: ['deptCode', 'deptName'] }).catch(
         () => {
            throw createError(500, '부서 조회 중 DB에서 오류발생');
         }
      );
   } catch (err) {
      throw err;
   }
};

export const getSelectedDeptDataDAO = async (deptCode) => {
   try {
      return await Department.findByPk(deptCode).catch(() => {
         throw createError(500, '부서 조회 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const editDeptDAO = async (deptCode, newDeptName, newDeptCode) => {
   try {
      return await Department.update(
         { deptName: newDeptName, deptCode: newDeptCode },

         { where: { deptCode: deptCode } }
      ).catch(() => {
         throw createError(500, '부서정보 변경 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const deleteDeptDAO = async (deptCode) => {
   try {
      return await Department.destroy({
         where: { deptCode: deptCode },
      }).catch(() => {
         throw createError(500, '부서 삭제 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};
