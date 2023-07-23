import db from '../models/index.js';
import {
   createError,
   getChangeHistoryMessage,
} from '../source/js/function/commonFn.js';

const Membership = db.Membership;

export const createMembership = async (req, res, next) => {
   try {
      const { membershipGrade, membershipName, discount, reference } = req.body;
      await Membership.create({
         membershipGrade: membershipGrade,
         membershipName: membershipName,
         discount: discount,
         reference: reference,
      }).catch(() => {
         throw createError(500, '멤버십 생성 중 DB에서 오류발생');
      });

      res.status(200).send(`${membershipName}등급 생성완료`);
   } catch (err) {
      next(err);
   }
};

export const getAllMemberships = async (req, res, next) => {
   try {
      const membershipDatas = await Membership.findAll({
         attributes: ['membershipName'],
      }).catch(() => {
         throw createError(500, '멤버십 조회 중 DB에서 오류발생');
      });

      res.status(200).json(membershipDatas);
   } catch (err) {
      next(err);
   }
};

export const getSelectedMemebership = async (req, res, next) => {
   try {
      const { membershipGrade } = req.bodyl;
      const membershipData = await Membership.findByPk(membershipGrade).catch(
         () => {
            throw createError(500, '멤버십 조회 중 DB에서 오류발생');
         }
      );

      res.status(200).json(membershipData);
   } catch (err) {
      next(err);
   }
};

export const editMembership = async (req, res, next) => {
   try {
      const {
         membershipGrade,
         newMembershipGrade,
         newMembershipName,
         newDiscount,
         newReference,
      } = req.body;

      const membershipData = await Membership.findByPk(membershipGrade).catch(
         () => {
            throw createError(500, '멤버십 조회 중 DB에서 오류발생');
         }
      );
      const newHistory = getChangeHistoryMessage(membershipData, req.body);
      await Membership.update(
         {
            membershipGrade: newMembershipGrade,
            membershipName: newMembershipName,
            discount: newDiscount,
            reference: newReference,
            changeHistory: db.Sequelize.fn(
               'JSON_ARRAY_APPEND',
               db.Sequelize.col('changeHistory'),
               '$',
               JSON.stringify(newHistory)
            ),
         },
         {
            where: { membershipGrade: membershipGrade },
         }
      ).catch(() => {
         throw createError(500, '멤버십 등급 삭제 중 DB에서 오류발생');
      });

      res.status(200).send(`${membershipGrade}등급 변경완료`);
   } catch (err) {
      next(err);
   }
};

export const deleteMembership = async (req, res, next) => {
   try {
      const { membershipGrade } = req.body;
      await Membership.destroy({
         where: { membershipGrade: membershipGrade },
      }).catch(() => {
         throw createError(500, '멤버십 등급 삭제 중 DB에서 오류발생');
      });

      res.status(200).send(`${membershipGrade.join()}등급 삭제완료`);
   } catch (err) {
      next(err);
   }
};
