import * as floorService from '../service/floorService.js';

export const getFloorsData = async (req, res, next) => {
   try {
      const response = await floorService.getFloorsDataService();

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};
export const createFloorsData = async (req, res, next) => {
   try {
      const response = await floorService.createFloorsDataServcie(req.body);

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};
