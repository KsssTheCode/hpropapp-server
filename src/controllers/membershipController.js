import * as membershipService from '../service/membershipService.js';

export const createMembership = async (req, res, next) => {
   try {
      const response = await membershipService.createMembershipService(
         req.body
      );

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getMembershipsDataForFilterSelection = async (req, res, next) => {
   try {
      const response =
         membershipService.getMembershipsDataForFilterSelectionService();

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getSelectedMemebership = async (req, res, next) => {
   try {
      const response = await membershipService.getSelectedMembershipService(
         req.body
      );

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const editMembership = async (req, res, next) => {
   try {
      const response = await membershipService.editMembershipService(req.body);

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const deleteMembership = async (req, res, next) => {
   try {
      const response = await membershipService.deleteMembershipService(
         req.body
      );
      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};
