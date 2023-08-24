import * as roomTypeDAO from '../data-access/roomTypeDAO.js';

export const createRoomTypeService = async (bodyData) => {
   try {
      const { roomTypeCode, roomTypeName, roomMaxPeople, rackRate } = bodyData;

      const createData = {
         roomTypeCode,
         roomTypeName,
         roomMaxPeople,
         rackRate,
      };

      return await roomTypeDAO.createRoomTypeDAO(createData);
   } catch (err) {
      throw err;
   }
};

export const getRoomTypesDataForFilterSelectionService = async () => {
   try {
      return await roomTypeDAO.getRoomTypesDataForFilterSelectionDAO();
   } catch (err) {
      throw err;
   }
};

export const getSelectedRoomTypeService = async (bodyData) => {
   try {
      const { roomTypeCode } = bodyData;
      return await roomTypeDAO.getSelectedRoomTypeDAO(roomTypeCode);
   } catch (err) {
      throw err;
   }
};

export const editRoomTypeService = async (bodyData) => {
   try {
      const {
         roomTypeCode,
         newRoomTypeCode,
         newRoomTypeName,
         newRoomMaxPeople,
         newRackRate,
      } = bodyData;

      const updateData = {
         ...(newRoomTypeCode && { roomTypeCode: newRoomTypeCode }),
         ...(roomTypeName && { roomTypeName: newRoomTypeName }),
         ...(roomMaxPeople && { roomMaxPeople: newRoomMaxPeople }),
         ...(rackRate && { rackRate: newRackRate }),
      };

      return await roomTypeDAO.editRoomTypeDAO(roomTypeCode, updateData);
   } catch (err) {
      throw err;
   }
};

export const deleteRoomTypeService = async (bodyData) => {
   try {
      const { roomTypeCode } = bodyData;
      return await roomTypeDAO.deleteRoomTypeDAO(roomTypeCode);
   } catch (err) {
      throw err;
   }
};
