import * as cleanStatusDAO from '../data-access/cleanStatusDAO.js';

export const createCleanStatusService = async (bodyData) => {
   try {
      const { cleanStatusCode, statusName } = bodyData;

      return await cleanStatusDAO.createCleanStatusDAO(
         cleanStatusCode,
         statusName
      );
   } catch (err) {
      throw err;
   }
};

export const deleteCleansStatusService = async (bodyData) => {
   try {
      const { cleanStatusCode } = bodyData;
      return await cleanStatusDAO.deleteCleansStatusDAO(cleanStatusCode);
   } catch (err) {
      throw err;
   }
};

export const getCleanStatusesService = async () => {
   try {
      return await cleanStatusDAO.getCleanStatusesDAO();
   } catch (err) {
      throw err;
   }
};
