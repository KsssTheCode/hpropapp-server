import fs from 'fs';
import bcrypt from 'bcrypt';
import fsPromise from 'fs/promises';
import * as validation from '../middleware/validation.js';

export const createStaff = (req, res, next) => {
   const { name, password, gender, birth, tel, address, adminYN } = req.body;
   let { enrollDate, deptCode } = req.body;

   //DB에서 호출 시, staffNo오름차순으로 정렬해서 받아오기
   const staffData = getData(res, './files/staff.json');

   let staffId = todayYYYYMMDD() + '001';
   const latestStaffId = staffData.Staffs.map((staff) => {
      return staff.staffId;
   })
      .sort()
      .at(-1);

   if (+staffId <= latestStaffId) {
      staffId = latestStaffId + 1;
   }

   checkDateValidation(res, '생일년월', birth, todayYYYYMMDD(8));

   if (!enrollDate) {
      enrollDate = todayYYYYMMDD(8);
   }
   checkDateValidation(res, '입사일', enrollDate, todayYYYYMMDD(8));
   checkNameValidation(res, name);
   checkPasswordValidation(res, password);

   if (!deptCode) {
      deptCode = 'NO';
   }
   checkDeptCodeValidation(res, deptCode);

   const salt = bcrypt.genSaltSync(10);
   const hashedPassword = bcrypt.hashSync(password, salt);

   const staff = {
      staffId,
      name,
      password: hashedPassword,
      gender,
      birth,
      tel,
      address,
      adminYN,
      enrollDate: todayYYYYMMDD(8),
      leaveDate: null,
      deptCode,
   };
   staffData.Staffs.push(staff);

   saveData(res, staffData, './files/staff.json');
   res.status(200).send('직원생성에 성공하였습니다.');
};

export const editStaff = (req, res) => {
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

   try {
      const staffData = getData(res, './files/staff.json');

      const staffIndex = findStaffIndex(staffData, staffId);
      if (staffIndex < 0) {
         const err = new Error('해당직원을 찾을 수 없습니다.');
         err.status = 404;
         throw err;
      }

      if (!enrollDate) {
         enrollDate = staffData.Staffs[staffIndex].enrollDate;
      }

      checkDateValidation(res, '생년월일', birth, todayYYYYMMDD(8));
      checkDateValidation(res, '입사일', enrollDate, todayYYYYMMDD(8));
      checkDateValidation(res, '퇴사일', leaveDate, todayYYYYMMDD(8));
      checkNameValidation(res, name);
      checkDeptCodeValidation(res, deptCode);

      staffData.Staffs[staffIndex] = {
         staffId,
         name,
         password: staffData.Staffs[staffIndex].password,
         gender,
         birth,
         tel,
         address,
         adminYN,
         enrollDate,
         leaveDate,
         deptCode,
      };

      saveData(res, staffData, './files/staff.json');
      res.status(200).send('직원수정에 성공하였습니다.');
   } catch {
      next(err);
   }
};

export const editPassword = (req, res) => {
   const { staffId, password, newPassword } = req.body;
   const staffData = getData(res, './files/staff.json');

   const staffIndex = findStaffIndex(staffData, staffId);

   if (!bcrypt.compareSync(password, StaffData.Staffs[staffIndex].password)) {
      res.status(400).send('기존 비밀번호가 일치하지 않습니다.');
      return;
   }

   const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,15}$/;
   if (!passwordRegex.test(newPassword)) {
      res.status(400).send('적절하지 않은 형식의 비밀번호입니다.');
      return;
   }

   const salt = bcrypt.genSaltSync(10);
   const hashedPassword = bcrypt.hashSync(password, salt);
   staffData.Staffs[staffIndex].password = hashedPassword;

   saveData(res, staffData, './files/staff.json');
   res.status(200).send('비밀번호 변경에 성공하였습니다.');
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

export const login = (req, res) => {
   const { staffId, password } = req.body;
   const StaffData = getData(res, './files/staff.json');

   const staffIndex = findStaffIndex(StaffData.Staffs, staffId);
   if (staffIndex < 0) {
      throw createError(409, '로그인 실패');
   }

   if (!bcrypt.compareSync(password, StaffData.Staffs[staffIndex].password)) {
      res.status(400).send('로그인 실패');
      return;
   }
   res.status(200).send('로그인 성공');
};

function getData(res, filePath) {
   let staffData;
   try {
      staffData = fs.readFileSync(filePath);
   } catch (err) {
      res.status(500).send('DB로부터의 송신에 실패했습니다.');
      return;
   }

   const parsedData = JSON.parse(staffData);
   return parsedData;
}

function saveData(res, staffData, filePath) {
   try {
      fs.writeFileSync(filePath, JSON.stringify(staffData));
   } catch (err) {
      res.status(500).send('DB로의 저장에 실패했습니다.');
      return;
   }
}

function findStaffIndex(data, staffId) {
   return data.findIndex((staff) => {
      return staff.staffId === staffId;
   });
}

function todayYYYYMMDD(yyyymmddRequest) {
   const year = new Date().getFullYear().toString().substring(2);
   let month = (new Date().getMonth() + 1).toString();
   month = month.length === 1 ? '0' + month : month;
   let date = new Date().getDate().toString();
   date = date.length === 1 ? '0' + date : date;

   if (arguments) {
      return new Date().getFullYear().toString() + month + date;
   } else {
      return year + month + date;
   }
}

function checkDateValidation(res, message, date, today) {
   const dateRegex =
      /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
   if (!dateRegex.test(date)) {
      const err = new Error(`적절하지 않은 형식의 ${message}입니다.`);
      err.status = 404;
      throw err;
   }
   if (+date > +today) {
      const err = new Error(
         `${message} 항목이 현재날짜보다 이른 시점이어야 합니다.`
      );
      err.status = 404;
      throw err;
   }
}

function checkNameValidation(res, name) {
   const nameRegex = /^[a-힣]{2,15}$/;
   if (!nameRegex.test(name)) {
      const err = new Error('적절하지 않은 형식의 이름입니다.');
      err.status = 404;
      throw err;
   }
}

function checkDeptCodeValidation(res, deptCode) {
   const deptCodes = ['RS', 'FO', 'HK', 'FB', 'HQ', 'NO'];
   const isExistingCode = deptCodes.some((code) => {
      return deptCode === code;
   });
   if (!isExistingCode) {
      const err = new Error('적절하지 않은 형식의 부서코드입니다.');
      err.status = 404;
      throw err;
   }
}

//최소 8 자 및 최대 15 자, 하나 이상의 대문자, 하나의 소문자, 하나의 숫자 및 하나의 특수 문자
function checkPasswordValidation(res, password) {
   const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,15}$/;
   if (!passwordRegex.test(password)) {
      const err = new Error('적절하지 않은 형식의 비밀번호입니다.');
      err.status = 404;
      throw err;
   }
}

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

function createError(status, message) {
   const error = new Error();
   error.status = status;
   error.message = message;
   return error;
}
