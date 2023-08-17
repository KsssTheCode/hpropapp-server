import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';

const Member = db.Member;

export const createMemberDAO = async (createData) => {
   try {
      return await Member.create(createData).catch(() => {
         throw createError(500, '고객생성 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const getAllMembersDAO = async (id) => {
   try {
      return await Member.findByPk(id).catch(() => {
         throw createError(500, '고객 조회 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const getMembersDataInFilterOptionsDAO = async (
   keyword,
   blackListYN,
   membershipGrades,
   startDate,
   endDate,
   nationalities
) => {
   try {
      return await Member.findAll({
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
      }).catch(() => {
         createError(500, '필터 정보로 고객 조회 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const editMemberDAO = async (id, staffId, updateData, transaction) => {
   try {
      return await Member.update(updateData, {
         where: { memberId: id },
         staffId,
         individualHooks: true,
         transaction,
      }).catch(() => {
         throw createError(500, '고객정보 수정 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};

export const deleteMemberDAO = async (id) => {
   try {
      return await Member.destroy({
         where: {
            memberId: id,
         },
      }).catch(() => {
         throw createError(500, '고객정보 삭제 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};
