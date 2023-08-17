import * as floorDAO from '../data-access/floorDAO.js';

export const getFloorsDataService = async () => {
   try {
      return await floorDAO.getFloorsDataService();
   } catch (err) {
      throw err;
   }
};
export const createFloorsDataServcie = async (bodyData) => {
   try {
      const { floors } = bodyData;
      const createData = floors.map((floor) => {
         return { floorNumber: floor };
      });

      return await floorDAO.createFloorsDataDAO(createData);
   } catch (err) {
      throw err;
   }
};
