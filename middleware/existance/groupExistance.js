import * as existance from '../../source/js/function/existance/existanceFn.js';
import {
   createError,
   countRecords,
} from '../../source/js/function/commonFn.js';

export const createGroupExistance = async (req, res, next) => {
   try {
      const { groupName } = req.body;
      const isDuplicateGroupName = await existance.checkExistingGroupByName(
         groupName
      );
      if (isDuplicateGroupName) throw createError(400, '이미 존재하는 단체명');
      next();
   } catch (err) {
      next(err);
   }
};
export const checkGroupExistanceOnly = async (req, res, next) => {
   try {
      const { groupId } = req.body;
      const isExistingGroup = await existance.checkExistingGroupById(groupId);
      if (!isExistingGroup) throw createError(400, '존재하지 않는 단체');
      next();
   } catch (err) {
      next(err);
   }
};

export const editGroupExistance = async (req, res, next) => {
   try {
      const { groupId, newGroupName } = req.body;
      const isExistingGroup = await existance.checkExistingGroupById(groupId);
      isExistingGroup
         ? (req.body.originalGroupData = isExistingGroup)
         : () => {
              throw createError(400, '존재하지 않는 단체');
           };

      if (newGroupName) {
         const isDuplicateGroupName = await existance.checkExistingGroupByName(
            newGroupName
         );
         if (isDuplicateGroupName)
            throw createError(400, '이미 존재하는 단체명');
      }
      next();
   } catch (err) {
      next(err);
   }
};
