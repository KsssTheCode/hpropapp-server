import { Op } from 'sequelize';
import db from '../models/index.js';
import {
   createError,
   getChangeHistoryMessage,
   createId,
   getOffset,
} from '../source/js/function/commonFn.js';

const Group = db.Group;

export const createGroup = async (req, res, next) => {
   try {
      const {
         groupName,
         representorName,
         representorTel,
         companyName,
         companyTel,
         companyAddress,
         reference,
      } = req.body;

      const groupId = 'G' + createId('group');

      await Group.create({
         groupId,
         groupName,
         representorName,
         representorTel,
         companyName,
         companyTel,
         companyAddress,
         reference,
      }).catch(() => {
         throw createError(500, '그룹 생성 중 DB에서 오류발생');
      });

      res.status(200).send(`그룹생성완료 \n (그룹번호 : G${groupId})`);
   } catch (err) {
      next(err);
   }
};

export const getGroupChangeHistory = async (req, res, next) => {
   try {
      const { groupId } = req.body;
      const changeHistory = await Rsvn.findOne({
         attributes: ['changeHistory'],
         where: {
            groupId: groupId,
         },
      }).catch(() => {
         throw createError(500, '단체 변경기록 조회 중 DB에서 오류발생');
      });

      res.status(200).json(changeHistory);
   } catch (err) {
      next(err);
   }
};

export const getAllGroups = async (req, res, next) => {
   try {
      const { page, itemsInOnePage } = req.body;
      const offset = getOffset(page, itemsInOnePage);

      const groupDatas = await Group.findAll({
         order: [['createdAt', 'desc']],
         offset: offset,
         limit: itemsInOnePage,
      }).catch(() => {
         throw createError(500, '단체 검색 중 DB에서 오류발생');
      });

      res.status(200).json(groupDatas);
   } catch (err) {
      next(err);
   }
};

export const getGroupsInOptions = async (req, res, next) => {
   try {
      const { page, itemsInOnePage, keyword, startDate, endDate } = req.body;
      const offset = getOffset(page, itemsInOnePage);

      const groupDatas = await Group.findAll({
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
         offset: offset,
         limit: itemsInOnePage,
      }).catch(() => {
         throw createError(500, '단체 검색 중 DB에서 오류발생');
      });

      res.status(200).json(groupDatas);
   } catch (err) {
      next(err);
   }
};

export const getSelectedGroup = async (req, res, next) => {
   try {
      const { groupId } = req.body;
      const groupData = await Group.findByPk(groupId).catch(() => {
         throw createError(500, '단체 조회 중 DB에서 오류발생');
      });

      res.status(200).json(groupData);
   } catch (err) {
      next(err);
   }
};

export const editGroup = async (req, res, next) => {
   try {
      const {
         groupId,
         newGroupName,
         newRepresentorName,
         newRepresentorTel,
         newCompanyName,
         newCompanyTel,
         newReference,
         originalGroupData,
      } = req.body;

      const newHistory = getChangeHistoryMessage(originalGroupData, req.body, [
         'groupId',
         'isExistingGroup',
         'changeHistory',
      ]);
      await Group.update(
         {
            groupName: newGroupName,
            representorName: newRepresentorName,
            representorTel: newRepresentorTel,
            companyName: newCompanyName,
            companyTel: newCompanyTel,
            companyAddress: newCompanyAddress,
            reference: newReference,
            changeHistory: db.Sequelize.fn(
               'JSON_ARRAY_APPEND',
               db.Sequelize.col('changeHistory'),
               '$',
               JSON.stringify(newHistory)
            ),
         },
         { where: { groupId: groupId }, individualHooks: true }
      ).catch(() => {
         throw createError(500, '단체정보 수정 중 DB에서 오류발생');
      });

      res.status(200).send('단체정보 수정완료');
   } catch (err) {
      next(err);
   }
};

export const deleteGroup = async (req, res, next) => {
   try {
      const { groupId } = req.body;
      await Group.destroy({
         where: {
            groupId: groupId,
         },
      }).catch((err) => {
         throw createError(500, '단체정보 삭제 중 DB에서 오류발생');
      });

      res.status(200).send('단체정보 삭제완료');
   } catch (err) {
      next(err);
   }
};
