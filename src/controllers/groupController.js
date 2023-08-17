import * as groupService from '../service/groupService.js';

export const createGroup = async (req, res, next) => {
   try {
      const response = await groupService.createGroupService(req.body);

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getGroupsDataInFilterOptions = async (req, res, next) => {
   try {
      const response = await groupService.getGroupsDataInFilterOptionsService(
         req.body
      );

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getSelectedGroup = async (req, res, next) => {
   try {
      const response = await groupService.getSelectedGroupService(req.body);

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const editGroup = async (req, res, next) => {
   try {
      const staffId = req.cookies.staffId;
      const response = await groupService.editGroupService(req.body, staffId);

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const deleteGroup = async (req, res, next) => {
   try {
      const response = await groupService.deleteGroupService(req.body);
      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};
