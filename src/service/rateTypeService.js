import * as rateTypeDAO from '../data-access/rateTypeDAO.js';

export const getRateTypesDataForFilterSelectionService = async () => {
   try {
      return await rateTypeDAO.getRateTypesDataForFilterSelectionDAO();
   } catch (err) {
      throw err;
   }
};
