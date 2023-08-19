import { Op } from 'sequelize';
import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';
import * as roomTypeService from '../service/roomTypeService.js';

const RoomType = db.RoomType;

export const createRoomType = async (req, res, next) => {
   try {
      const response = await roomTypeService.createRoomTypeService(req.body);

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getRoomTypesDataForFilterSelection = async (req, res, next) => {
   try {
      const response =
         await roomTypeService.getRoomTypesDataForFilterSelectionService();

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const getSelectedRoomType = async (req, res, next) => {
   try {
      const response = await roomTypeService.getSelectedRoomTypeService(
         req.body
      );

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const editRoomType = async (req, res, next) => {
   try {
      const response = await roomTypeService.editRoomTypeService(req.body);

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const deleteRoomType = async (req, res, next) => {
   try {
      const response = await roomTypeService.deleteRoomTypeService(req.body);

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};
