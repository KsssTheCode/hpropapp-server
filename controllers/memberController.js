import db from '../models/index.js';
import {
   createError,
   createId,
   getOffset,
} from '../source/js/function/commonFn.js';

const Member = db.Member;

export const createMember = async (req, res, next) => {
   try {
      const {
         name,
         gender,
         birth,
         tel,
         address,
         nationality,
         carNumber,
         blackListYN,
         reference,
         membershipGrade,
      } = req.body;

      let memberId = 'M' + (await createId('Member'));

      await Member.create({
         memberId,
         name,
         gender,
         birth,
         tel,
         address,
         nationality,
         carNumber,
         blackListYN,
         reference,
         membershipGrade,
         // ...(gender && { gender }),
         // ...(birth && { birth }),
         // tel,
         // ...(address && { address }),
         // ...(nationality && { nationality }),
         // ...(carNumber && { carNumber }),
         // ...(blackListYN && { blackListYN }),
         // ...(reference && { reference }),
         // ...(membershipGrade && { membershipGrade }),
      }).catch((err) => {
         throw createError(500, '고객생성 중 DB에서 오류발생');
      });

      res.status(200).send(`고객생성완료 \n(고객번호 : ${memberId})`);
   } catch (err) {
      next(err);
   }
};

export const getAllMembers = async (req, res, next) => {
   try {
      const { page, itemsInOnePage } = req.body;
      const offset = getOffset(page, itemsInOnePage);

      const memberDatas = await Member.findAll({
         order: [['createdAt', 'desc']],
         offset: offset,
         limit: itemsInOnePage,
      }).catch(() => {
         throw createError(500, '멤버 조회 중 DB에서 오류발생');
      });
      res.status(200).json(memberDatas);
   } catch (err) {
      next(err);
   }
};

export const getSelectedMember = async (req, res, next) => {
   try {
      const memberData = await Member.findByPk(req.body.memberId).catch(() => {
         throw createError(500, '고객 조회 중 DB에서 오류발생');
      });

      res.status(200).json(memberData);
   } catch (err) {
      next(err);
   }
};

export const getMembersInOptions = async (req, res, next) => {
   try {
      const {
         page,
         itemsInOnePage,
         keyword,
         blackListYN,
         membershipGrades,
         startDate, //생성일
         endDate, // 생성일
         nationalities,
      } = req.body;
      const offset = getOffset(page, itemsInOnePage);

      //방문횟수도 고려해봐야함
      const memberDatas = await Member.findAll({
         where: {
            name: { [Op.like]: `%${keyword}%` },
            reference: { [Op.like]: `%${keyword}%` },
            blackListYN: blackListYN,
            membershipGrade: { [Op.in]: membershipGrades },
            createdAt: { [Op.between]: [startDate, endDate] },
            nationality: { [Op.in]: nationalities },
            include: [
               {
                  model: Membership,
                  where: {
                     membershipGrade: { [Op.in]: membershipGrade },
                  },
               },
            ],
         },
         order: [['createdAt', 'desc']],
         offset: offset,
         limit: itemsInOnePage,
      }).catch((err) => {
         next(err);
      });

      res.status(200).json(memberDatas);
   } catch (err) {
      next(err);
   }
};

export const autoCompeletionWithName = async (req, res, next) => {
   try {
      const { name } = req.body;

      const relatedMemberDatas = await Member.findAll(
         { attributes: ['name', 'tel'] },
         { where: { name: { [Op.like]: `%${name}%` } } }
      );
      res.status(200).json(relatedMemberDatas);
   } catch (err) {
      next(err);
   }
};

export const editMember = async (req, res, next) => {
   const transaction = db.sequelize.transaction();
   try {
      const {
         memberId,
         newName,
         newGender,
         newBirth,
         newTel,
         newAddress,
         newNationality,
         newCarNumber,
         blackListYN,
         newMembershipGrade,
         newReference,
      } = req.body;

      await Member.update(
         {
            name: newName,
            gender: newGender,
            birth: newBirth,
            tel: newTel,
            address: newAddress,
            nationality: newNationality,
            carNumber: newCarNumber,
            blackListYN,
            membershipGrade: newMembershipGrade,
            reference: newReference,
         },
         { where: { memberId: memberId }, transaction: transaction }
      ).catch(() => {
         throw createError(500, '고객정보 수정 중 DB에서 오류발생');
      });

      transaction.commit();
      res.status(200).send('고객정보 수정완료');
   } catch (err) {
      transaction.rollback();
      next(err);
   }
};

export const deleteMember = async (req, res, next) => {
   try {
      const { memberId } = req.body;
      await Member.destroy({
         where: {
            memberId: memberId,
         },
      }).catch(() => {
         throw createError(500, '고객정보 삭제 중 DB에서 오류발생');
      });

      res.status(200).send('고객정보 삭제완료');
   } catch (err) {
      next(err);
   }
};
