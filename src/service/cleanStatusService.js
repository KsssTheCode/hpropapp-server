import * as cleanStatusDAO from '../data-access/cleanStatusDAO';

export const createCleanStatusService = async (bodyData) => {
   try {
      const { statusCode, statusName } = bodyData;

      return await cleanStatusDAO.createCleanStatusDAO(statusCode, statusName);
   } catch (err) {
      throw err;
   }
};

export const deleteCleansStatusService = async (bodyData) => {
   try {
      const { statusCode } = bodyData;
      return await cleanStatusDAO.deleteCleansStatusDAO(statusCode);
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
