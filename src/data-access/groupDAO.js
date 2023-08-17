import db from '../models/index.js';

import { Op } from 'sequelize';
import { createError } from '../source/js/function/commonFn.js';

const Group = db.Group;

export const createGroupDAO = async (createData) => {
   try {
      return await Group.create(createData).catch(() => {
         throw createError(500, '그룹 생성 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const getGroupsDataInFilterOptionsDAO = async (
   keyword,
   startDate,
   endDate
) => {
   try {
      return await Group.findAll({
         where: {
            groupName: { [Op.like]: `%${keyword}%` },
            groupId: { [Op.like]: `%${keyword}%` },
            representorName: { [Op.like]: `%${keyword}%` },
            representorTel: { [Op.like]: `%${keyword}%` },
            companyName: { [Op.like]: `%${keyword}%` },
            companyTel: { [Op.like]: `%${keyword}%` },
            companyAddress: { [Op.like]: `%${keyword}%` },
            reference: { [Op.like]: `%${keyword}%` },
            createdAt: { [Op.between]: [startDate, endDate] },
         },
         order: [['createdAt', 'desc']],
      }).catch(() => {
         throw createError(500, '단체 검색 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const getSelectedGroupDAO = async (id) => {
   try {
      return await Group.findByPk(id).catch(() => {
         throw createError(500, '단체 조회 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const editGroupDAO = async (id, staffId, updateData, transaction) => {
   try {
      await Group.update(updateData, {
         where: { groupId: id },
         staffId,
         individualHooks: true,
         transaction,
      }).catch(() => {
         throw createError(500, '단체정보 수정 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const deleteGroupDAO = async (id) => {
   try {
      return await Group.destroy({
         where: {
            groupId: id,
         },
      }).catch(() => {
         throw createError(500, '단체정보 삭제 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};
