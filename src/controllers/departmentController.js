import * as deptService from '../service/departmentService.js';

export const createDept = async (req, res, next) => {
   try {
      const response = await deptService.createDeptService(req.body);

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getDeptsDataForFilterSelection = async (req, res, next) => {
   try {
      const response = deptService.getDeptsDataForFilterSelectionService(
         req.query
      );
      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getSelectedDeptData = async (req, res, next) => {
   try {
      const respone = await deptService.getSelectedDeptDataService(req.body);

      res.status(200).json(respone);
   } catch (err) {
      next(err);
   }
};

export const editDept = async (req, res, next) => {
   try {
      const response = deptService.editDeptService(req.body);

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const deleteDept = async (req, res, next) => {
   try {
      const response = await deptService.deleteDeptService(req.body);

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};
