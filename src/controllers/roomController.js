import * as roomService from '../service/roomService.js';

export const createRooms = async (req, res, next) => {
   try {
      const { roomNumbers } = req.body;
      const { isExistingRooms, notExistingRooms } = req.body.rooms;
      const response = await roomService.createRoomsService(req.body);

      notExistingRooms.length === roomNumbers.length
         ? res.status(200).json(response)
         : res
              .status(200)
              .send(
                 `일부객실 생성 성공 \n 성공 : '${notExistingRooms.join()}' \n 실패 : '${isExistingRooms.join()}'(이미 존재하는 객실)`
              );
   } catch (err) {
      next(err);
   }
};

export const assignRoom = async (req, res, next) => {
   try {
      const response = await roomService.assignRoomServcie(req.body);

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getRoomsForRoomPreview = async (req, res, next) => {
   try {
      const roomPreviewData = await roomService.getRoomsForRoomPreview();

      res.status(200).json(roomPreviewData);
   } catch (err) {
      next(err);
   }
};

export const getRoomsInReserveStatus = async (req, res, next) => {
   try {
      const roomsData = roomService.getRoomsInReserveStatusService();

      res.status(200).json(roomsData);
   } catch (err) {
      next(err);
   }
};

export const getRoomsDataInOptionsForAssign = async (req, res, next) => {
   const { roomTypeCodes, startDate, endDate, floors, cleanStatusCodes } =
      req.query;
   try {
      const response = await roomService.getRoomsDataInOptionsForAssignService(
         req.query
      );

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const editRoomTypeOfRooms = async (req, res, next) => {
   try {
      const { roomNumbers } = req.body;
      const { isExistingRooms, notExistingRooms } = req.body.rooms;

      const response = await roomService.editRoomTypeOfRoomsService(req.body);

      isExistingRooms.length === roomNumbers.length
         ? res.status(200).send('모든객실 변경완료')
         : res
              .status(200)
              .send(
                 `일부객실 변경 성공 \n 성공 : ${isExistingRooms.join()} \n 실패 : ${notExistingRooms.join()}(존재하지 않은 객실)`
              );
   } catch (err) {
      next(err);
   }
};

export const deleteRooms = async (req, res, next) => {
   try {
      const { roomNumbers } = req.body;
      const { isExistingRooms, notExistingRooms } = req.body.rooms;

      const response = await roomService.deleteRoomsService(isExistingRooms);

      isExistingRooms.length === roomNumbers.length
         ? res.status(200).json('모든객실 비활성화 완료')
         : res
              .status(200)
              .send(
                 `일부객실 삭제(비활성화) 성공 \n 성공 : ${isExistingRooms.join()} \n 실패 : ${notExistingRooms.join()}(존재하지 않은 객실)`
              );
   } catch (err) {
      next(err);
   }
};

export const getAllRoomsForPreview = async (req, res, next) => {
   try {
      const response = await roomService.getAllRoomsForPreviewService();

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getRoomsInOptionsForPreview = async (req, res, next) => {
   try {
      const response = roomService.getRoomsInOptionsForPreviewService(
         req.query
      );

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};
