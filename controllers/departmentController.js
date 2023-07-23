import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';

const Department = db.Department;

export const createDepartment = async (req, res, next) => {
   try {
      const { deptCode, deptName } = req.body;
      await Department.create({
         deptCode: deptCode,
         deptName: deptName,
      }).catch(() => {
         throw createError(500, '부서생성 중 DB에서 오류 발생');
      });

      res.status(200).send('부서 생성 성공');
   } catch (err) {
      next(err);
   }
};

export const getAllDepartments = async (req, res, next) => {
   try {
      const { attributes } = req.query;
      let attributesArr = null;
      if (attributes) attributesArr = attributes.split(',');

      const departmentsData = await Department.findAll({
         attributes: attributesArr,
      }).catch(() => {
         throw createError(500, '부서 조회 중 DB에서 오류발생');
      });
      res.status(200).json(departmentsData);
   } catch (err) {
      next(err);
   }
};

export const getSelectedDepartment = async (req, res, next) => {
   try {
      const { deptCode } = req.body;
      const departmentData = await Department.findByPk(deptCode).catch(() => {
         throw createError(500, '부서 조회 중 DB에서 오류발생');
      });

      res.status(200).json(departmentData);
   } catch (err) {
      next(err);
   }
};

export const editDepertment = async (req, res, next) => {
   try {
      const { deptCode, newDeptName, newDeptCode } = req.body;
      await Department.update(
         { deptName: newDeptName, deptCode: newDeptCode },

         { where: { deptCode: deptCode } }
      ).catch(() => {
         throw createError(500, '부서정보 변경 중 DB에서 오류발생');
      });

      res.status(200).send('부서정보 변경완료');
   } catch (err) {
      next(err);
   }
};

export const deleteDepartment = async (req, res, next) => {
   try {
      const { deptCode } = req.body;
      await Department.destroy({
         where: { deptCode: deptCode },
      }).catch(() => {
         throw createError(500, '부서 삭제 중 DB에서 오류발생');
      });

      res.status(200).send('부서 삭제완료');
   } catch (err) {
      next(err);
   }
};
