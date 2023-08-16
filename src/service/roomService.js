import moment from 'moment';
import * as roomDAO from '../data-access/roomDAO.js';

export const createRoomsService = async (bodyData) => {
   try {
      const { roomTypeCode, rooms } = bodyData;
      const { notExistingRooms } = rooms;

      const createRoomsData = notExistingRooms.map((roomNumber) => {
         return {
            roomNumber: roomNumber,
            roomTypeCode: roomTypeCode,
            floorNumber: roomNumber.toString().slice(0, -2),
            cleanStatusCodes: 'C',
         };
      });

      return await roomDAO.createRoomsDAO(createRoomsData);
   } catch (err) {
      throw err;
   }
};

export const assignRoomServcie = async (bodyData) => {
   try {
      const { roomNumber, rsvnId } = bodyData;

      return await roomDAO.assignRoomDAO(roomNumber, rsvnId);
   } catch (err) {
      throw err;
   }
};

export const getRoomsForRoomPreview = async () => {
   try {
      const roomsData = await roomDAO.getAllRoomsDataForPreview();

      const today = moment().format('YYYYMMDD');
      const assignedRsvnsData = await roomDAO.getAssignedRsvnsDataForPreview(
         today
      );

      const roomPreviewData = roomsData.map((room, i) => {
         const rsvn = assignedRsvnsData.find((rsvn) => {
            return rsvn.roomNumber === room.roomNumber;
         });
         if (rsvn)
            return { ...room.dataValues, rsvnData: { ...rsvn.dataValues } };
         return { ...room.dataValues };
      });

      return roomPreviewData;
   } catch (err) {
      throw err;
   }
};

export const getRoomsInReserveStatusService = async () => {
   try {
      return await roomDAO.getRoomsInReserveStatusDAO();
   } catch (err) {
      throw err;
   }
};

export const getRoomsDataInOptionsForAssignService = async (queryData) => {
   try {
      const { roomTypeCodes, startDate, endDate, floors, cleanStatusCodes } =
         queryData;

      const reservedRoomNumbers = await roomDAO.getAssignedRoomNumbersInTermDAO(
         startDate,
         endDate
      );

      const reservedRooms = [];
      reservedRoomNumbers.forEach((rsvn) => {
         if (rsvn.roomNumber) reservedRooms.push(rsvn.roomNumber);
      });

      const roomsData = await roomDAO.getRoomsDataInOptionsForAssignDAO(
         reservedRooms,
         roomTypeCodes,
         cleanStatusCodes,
         floors
      );

      return roomsData;
   } catch (err) {
      throw err;
   }
};

export const editRoomTypeOfRoomsService = async (bodyData) => {
   try {
      const { roomTypeCode, rooms } = bodyData;
      const { isExistingRooms } = rooms;
      return await roomDAO.editRoomTypeOfRoomsDAO(
         roomTypeCode,
         isExistingRooms
      );
   } catch (err) {
      throw err;
   }
};

export const deleteRoomsService = async (isExistingRooms) => {
   try {
      return await roomDAO.deleteRoomsDAO(isExistingRooms);
   } catch (err) {
      throw err;
   }
};

export const getAllRoomsForPreviewService = async () => {
   try {
      return await roomDAO.getAllRoomsForPreviewDAO();
   } catch (err) {
      throw err;
   }
};

export const getRoomsInOptionsForPreviewService = async (queryData) => {
   try {
      const { floors, cleanStatusCodes, groupIds, roomTypeCodes } = queryData;
      return await roomDAO.getRoomsInOptionsForPreviewDAO(
         groupIds,
         floors,
         cleanStatusCodes,
         roomTypeCodes
      );
   } catch (err) {
      throw err;
   }
};
