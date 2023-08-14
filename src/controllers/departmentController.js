import * as deptService from '../service/departmentService.js';

export const createDepartment = async (req, res, next) => {
   try {
      const response = await deptService.createDepartmentService(req.body);

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getDepartmentsInOptions = async (req, res, next) => {
   try {
      const response = deptService.getDepartmentsInOptionsService(req.query);
      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getSelectedDepartment = async (req, res, next) => {
   try {
      const respone = await deptService.getSelectedDepartmentService(req.body);

      res.status(200).json(respone);
   } catch (err) {
      next(err);
   }
};

export const editDepertment = async (req, res, next) => {
   try {
      const response = deptService.editDepartmentService(req.body);

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const deleteDepartment = async (req, res, next) => {
   try {
      const response = await deptService.deleteDepartmentService(req.body);

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};
