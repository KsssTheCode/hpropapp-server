import * as cleanStatusService from '../service/cleanStatusService';

export const createCleanStatus = async (req, res, next) => {
   try {
      const response = await cleanStatusService.createCleanStatusService(
         req.body
      );

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const deleteCleanStatus = async (req, res, next) => {
   try {
      const response = await cleanStatusService.deleteCleansStatusService(
         req.body
      );

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getCleanStatuses = async (req, res, next) => {
   try {
      const response = await cleanStatusService.getCleanStatusesService();
      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};
