import * as rateTypeDAO from '../data-access/rateTypeDAO.js';

export const createRateTypeService = async (bodyData) => {
   try {
      const { rateTypeCode, reference } = bodyData;
      const createData = {
         rateTypeCode,
         reference,
      };
      return await rateTypeDAO.createRateTypeDAO(createData);
   } catch (err) {
      throw err;
   }
};

export const getRateTypesDataForFilterSelectionService = async () => {
   try {
      return await rateTypeDAO.getRateTypesDataForFilterSelectionDAO();
   } catch (err) {
      throw err;
   }
};

export const editRateTypeService = async (bodyData) => {
   try {
      const { rateTypeCode, newRateTypeCode, newReference } = bodyData;
      const updateData = {
         ...(newRateTypeCode && { rateTypeCode: newRateTypeCode }),
         ...(newReference && { reference: newReference }),
      };
      return await rateTypeDAO.editRateTypeDAO(rateTypeCode, updateData);
   } catch (err) {
      throw err;
   }
};

export const deleteRateTypeService = async () => {
   try {
      const { rateTypeCode } = bodyData;
      return await rateTypeDAO.deleteRateTypeDAO(rateTypeCode);
   } catch (err) {
      throw err;
   }
};
