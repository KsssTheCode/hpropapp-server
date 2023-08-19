import * as rateTypeService from '../service/rateTypeService.js';

export const createRateType = async (req, res, next) => {
   try {
      const response = await rateTypeService.createRateTypeService(req.body);

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getRateTypesDataForFilterSelection = async (req, res, next) => {
   try {
      const response =
         await rateTypeService.getRateTypesDataForFilterSelectionService();

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const editRateType = async (req, res, next) => {
   try {
      const response = await rateTypeService.editRateTypeService(req.body);

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const deleteRateType = async (req, res, next) => {
   try {
      const response = await rateTypeService.deleteRateTypeService(rqe.body);

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};
