import fsPromise from 'fs/promises';
import bcrypt from 'bcrypt';
import * as validation from '../middleware/validation.js';

export const createStaff = (req, res, next) => {
   const { name, gender, birth, tel, address, adminYN } = req.body;
   let { enrollDate, deptCode } = req.body;

   //유효성검사
   validation.nameCheck(name);
   validation.genderCheck(gender);
   validation.birthCheck(birth);
   validation.telCheck(tel);
   validation.adminCheck(adminYN);
   validation.deptCodeCheck(deptCode);

   fsPromise
      .readFile('./files/staff.json')
      .then((rawData) => {
         const StaffData = JSON.parse(rawData);

         //자동생성 : 사번생성
         let staffId = dateFormat(6) + '001';
         const latestStaffId = StaffData.Staffs.map((staff) => {
            return staff.staffId;
         })
            .sort()
            .at(-1);
         if (+staffId <= +latestStaffId) {
            staffId = +latestStaffId + 1;
         }

         // 입사일 자동생성, 유효성검사
         if (!enrollDate) {
            enrollDate = dateFormat(8);
         } else {
            validation.enrollDateCheck(enrollDate);
         }

         //비밀번호 생성 암호화
         const salt = bcrypt.genSaltSync(10);
         const hashedPassword = bcrypt.hashSync('Password!', salt);

         const newStaff = {
            staffId: staffId.toString(),
            name,
            password: hashedPassword,
            gender,
            birth: +birth,
            tel: +tel,
            address,
            adminYN,
            enrollDate: +enrollDate,
            leaveDate: null,
            deptCode,
         };

         StaffData.Staffs.push(newStaff);

         return fsPromise.writeFile(
            './files/staff.json',
            JSON.stringify(StaffData)
         );
      })
      .catch((error) => {
         next(error);
         return Promise.reject();
      })
      .then(() => {
         res.status(200).send('직원생성완료');
      })
      .catch((error) => {
         next(error);
      });
};

export const editStaff = (req, res, next) => {
   const {
      staffId,
      name,
      gender,
      birth,
      tel,
      address,
      adminYN,
      enrollDate,
      leaveDate,
      deptCode,
   } = req.body;

   validation.nameCheck(name);
   validation.genderCheck(gender);
   validation.birthCheck(birth);
   validation.telCheck(tel);
   validation.adminCheck(adminYN);
   validation.enrollDateCheck(enrollDate);

   if (!leaveDate) {
      leaveDate = null;
   } else {
      validation.leaveDateCheck(leaveDate);
   }
   deptCode = validation.deptCodeCheck(deptCode);

   fsPromise
      .readFile('./files/staff.json')
      .then((rawData) => {
         const StaffData = JSON.parse(rawData);

         const staffIndex = findStaffIndex(StaffData.Staffs, staffId);
         if (staffIndex < 0) {
            throw createError(409, '직원이 존재하지 않습니다.');
         }

         const editStaff = {
            staffId,
            name,
            gender,
            birth: +birth,
            tel: +tel,
            address,
            adminYN,
            enrollDate: +enrollDate,
            leaveDate,
            deptCode,
         };

         StaffData.Staffs[staffIndex] = editStaff;

         return fsPromise.writeFile(
            './files/staff.json',
            JSON.stringify(StaffData)
         );
      })
      .catch((error) => {
         next(error);
         return Promise.reject();
      })
      .then(() => {
         res.status(200).send('직원수정 성공');
      })
      .catch((error) => {
         next(error);
      });
};

export const resetPassword = (req, res, next) => {
   const { staffId } = req.body;
   fsPromise
      .readFile('./files/staff.json')
      .then((rawData) => {
         const StaffData = JSON.parse(rawData);

         const staffIndex = findStaffIndex(StaffData.Staffs, staffId);
         if (staffIndex < 0) {
            throw createError(409, '존재하지 않는 직원');
         }

         const salt = bcrypt.genSaltSync(10);
         const hashedPassword = bcrypt.hashSync('Newpassword!', salt);
         StaffData.Staffs[staffIndex].password = hashedPassword;

         return fsPromise.writeFile(
            './files/staff.json',
            JSON.stringify(StaffData)
         );
      })
      .catch((error) => {
         next(error);
         return Promise.reject();
      })
      .then(() => {
         res.status(200).send(
            '비밀번호 초기화완료 \n 즉시 변경 필수 (초기화 : Newwpassword!)'
         );
      })
      .catch((error) => {
         next(error);
      });
};

export const editPassword = (req, res, next) => {
   const { staffId, password, newPassword } = req.body;

   fsPromise
      .readFile('./files/staff.json')
      .then((rawData) => {
         const StaffData = JSON.parse(rawData);

         const staffIndex = findStaffIndex(StaffData.Staffs, staffId);
         if (staffIndex < 0) {
            throw createError(409, '존재하지 않는 직원');
         }

         if (
            !bcrypt.compareSync(password, StaffData.Staffs[staffIndex].password)
         ) {
            throw createError(400, '기존 비밀번호가 일치하지 않습니다.');
         }

         validation.passwordCheck(newPassword);

         const salt = bcrypt.genSaltSync(10);
         const hashedPassword = bcrypt.hashSync(newPassword, salt);
         StaffData.Staffs[staffIndex].password = hashedPassword;

         return fsPromise.writeFile(
            './files/staff.json',
            JSON.parse(StaffData)
         );
      })
      .catch((error) => {
         next(error);
         return Promise.reject();
      })
      .then(() => {
         res.status(200).send('비밀번호 변경 완료');
      })
      .catch((error) => {
         next(error);
      });
};

export const login = (req, res, next) => {
   const { staffId, password } = req.body;

   fsPromise
      .readFile('./files/staff.json')
      .then((rawData) => {
         const StaffData = JSON.parse(rawData);

         const staffIndex = findStaffIndex(StaffData.Staffs, staffId);
         if (staffIndex < 0) {
            throw createError(409, '존재하지 않는 사번');
         }

         if (
            !bcrypt.compareSync(password, StaffData.Staffs[staffIndex].password)
         ) {
            throw createError(400, '로그인 실패');
         }
      })
      .then(() => {
         res.status(200).send('로그인 성공');
      })
      .catch((error) => {
         next(error);
      });
};

export const deleteStaff = (req, res) => {
   const { staffId } = req.body;

   fsPromise
      .readFile('../files/staff.json')
      .then((rawData) => {
         const StaffData = JSON.parse(rawData);

         const staffIndex = findStaffIndex(StaffData.Staffs, staffId);
         if (staffIndex < 0) {
            throw createError(409, '존재하지 않는 직원');
         }

         StaffData.Staffs.splice(staffIndex, 1);

         return fsPromise.writeFile(
            '../files/staff.json',
            JSON.stringify(StaffData)
         );
      })
      .catch((error) => {
         next(error);
         return Promise.reject();
      })
      .then(() => {
         res.status(200).send('직원삭제완료');
      })
      .catch((error) => {
         next(error);
      });
};

function dateFormat(length) {
   const year = new Date().getFullYear().toString().substring(2);
   let month = (new Date().getMonth() + 1).toString();
   month = month.length === 1 ? '0' + month : month;
   let date = new Date().getDate().toString();
   date = date.length === 1 ? '0' + date : date;

   if (length === 8) {
      return new Date().getFullYear().toString() + month + date;
   } else if (length === 6) {
      return year + month + date;
   }
}

function findStaffIndex(data, staffId) {
   return data.findIndex((staff) => {
      return staff.staffId === staffId;
   });
}

function createError(status, message) {
   const error = new Error();
   error.status = status;
   error.message = message;
   return error;
}
