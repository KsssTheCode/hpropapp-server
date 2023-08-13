import db from '../models/index.js';
import * as authFn from '../source/js/function/authFn.js';
import { createError, createId } from '../source/js/function/commonFn.js';

const Staff = db.Staff;

export const createStaff = async (req, res, next) => {
   try {
      const { name, gender, birth, tel, address, enrollDate, deptCode } =
         req.body;

      let staffId = await createId('staff');

      const hashedPassword = authFn.createHashedPassword('Password!');

      await Staff.create({
         staffId,
         password: hashedPassword,
         name,
         gender,
         birth,
         tel,
         address,
         enrollDate,
         role: 'MANAGER',
         deptCode,
      }).catch(() => {
         throw createError(500, '직원생성 중 DB에서 오류발생');
      });

      res.status(200).send('생성 완료');
   } catch (err) {
      next(err);
   }
};

export const getStaffs = async (req, res, next) => {
   try {
      const staffsData = await Staff.findAll(
         { attributes: ['name', 'staffId'] },
         {
            where: { leaveDate: null },
            include: {
               model: db.Department,
               attributes: ['deptName'],
            },
            order: [['createdAt', 'desc']],
         }
      ).catch(() => {
         throw createError(500, '직원 검색 중 DB에서 오류발생');
      });
      res.status(200).json(staffsData);
   } catch (err) {
      next(err);
   }
};

/* 추후 관리자 메뉴 생성 시 사용할 컨트롤러*/
// export const getStaffChangeHistory = async (req, res, next) => {
//    try {
//       const { staffId } = req.body;
//       const changeHistory = await Staff.findOne({
//          attributes: ['changeHistory'],
//          where: {
//             staffId: staffId,
//          },
//       }).catch(() => {
//          throw createError(500, '직원 변경기록 조회 중 DB에서 오류발생');
//       });

//       res.status(200).json(changeHistory);
//    } catch (err) {
//       next(err);
//    }
// };

// export const getStaffInOptions = async (req, res, next) => {
//    try {
//       const {
//          page,
//          itemsInOnePage,
//          startDate,
//          endDate,
//          keyword,
//          deptCodes,
//          leaveYN,
//       } = req.body;
//       const offset = getOffset(page, itemsInOnePage);

//       const staffDatas = await Staff.findAll({
//          where: {
//             createdAt: { [Op.between]: [startDate, endDate] },
//             name: { [Op.like]: `%${keyword}%` },
//             address: { [Op.like]: `%${keyword}%` },
//             tel: { [Op.like]: `%${keyword}%` },
//             staffId: { [Op.like]: `%${keyword}%` },
//             deptCode: { [Op.in]: deptCodes },
//             leaveDate: leaveYN,
//          },
//          order: [['createdAt', 'desc']],
//          offset: offset,
//          limit: itemsInOnePage,
//       }).catch(() => {
//          throw createError(500, '단체 검색 중 DB에서 오류발생');
//       });

//       res.status(200).json(staffDatas);
//    } catch (err) {
//       next(err);
//    }
// };

// export const getSelectedStaff = async (req, res, next) => {
//    try {
//       const { staffId } = req.body;
//       const staffData = await Staff.findOne({
//          where: { staffId: staffId },
//       }).catch(() => {
//          throw createError(500, '단체 검색 중 DB에서 오류발생');
//       });

//       res.status(200).json(staffData);
//    } catch (err) {
//       next(err);
//    }
// };

// export const editStaff = async (req, res, next) => {
//    try {
//       const {
//          staffId,
//          name,
//          gender,
//          birth,
//          tel,
//          enrollDate,
//          leaveDate,
//          deptCode,
//       } = req.body;

//       const newHistory = getChangeHistoryMessage(group, req.body);

//       await Staff.update(
//          {
//             ...(name && {name}),
//             ...(gender && {gender}),
//             ...(birth && {birth}),
//             ...(tel && {tel}),
//             ...(enrollDate && {enrollDate}),
//             ...(leaveDate && {leaveDate}),
//             ...(deptCode && {deptCode}),
//             changeHistory: db.Sequelize.fn(
//                'JSON_ARRAY_APPEND',
//                db.Sequelize.col('changeHistory'),
//                '$',
//                JSON.stringify(newHistory)
//             ),

//          },
//          { where: { staffId: staffId } }
//       ).catch(() => {
//          throw createError(500, '직원정보 수정 중 DB에서 오류발생');
//       });

//       res.status(200).send('직원 수정 완료');
//    } catch (err) {
//       next(err);
//    }
// };

// export const resetPassword = async (req, res, next) => {
//    try {
//       const { staffId } = req.body;

//       const hashedPassword = authFn.createHashedPassword('resetPassword!');

//       //암호화된 초기화비밀번호를 생성하여, 해당 사번의 직원비밀번호로 변경
//       Staff.update(
//          { password: hashedPassword },
//          { where: { staffId: staffId } }
//       ).catch(() => {
//          throw createError(500, '비밀번호 초기화 중 DB에서 오류발생');
//       });

//       res.status(200).send(
//          '비밀번호 초기화 완료 \n 초기화비밀번호 : resetPassword! 즉시변경요망 '
//       );
//    } catch (err) {
//       next(err);
//    }
// };

// export const editPassword = async (req, res, next) => {
//    try {
//       const { staffId, password, newPassword, isExistingStaff } = req.body;

//       // const isExistingStaff = await authFn.checkExistingStaff(staffId);
//       authFn.checkPassword(isExistingStaff, password, '비밀번호 불일치');

//       const hashedPassword = authFn.createHashedPassword(newPassword);

//       await Staff.update(
//          { password: hashedPassword },
//          { where: { staffId: staffId } }
//       ).catch(() => {
//          throw createError(500, '비밀번호 변경 중 DB에서 오류발생');
//       });

//       res.status(200).send('비밀번호 변경완료');
//    } catch (err) {
//       next(err);
//    }
// };

// export const resignStaff = async (req, res, next) => {
//    try {
//       const { staffId } = req.body;
//       //요청된 사번에 해당하는 직원의 LeaveDate(=null)에 현재날짜를 입력

//       await Staff.update(
//          { leaveDate: currentDateFormat(8) },
//          { where: { staffId: staffId } }
//       ).catch(() => {
//          throw createError(500, '직원정보 수정 중 DB에서 오류발생');
//       });

//       res.status(200).send('퇴사처리 완료');
//    } catch (err) {
//       next(err);
//    }
// };
