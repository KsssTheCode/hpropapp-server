import { axiosFn } from './testFunction.js';

describe('Auth - Create Staff', () => {
   test('필수입력값이 하나 이상 미입력', async () => {
      const result = await axiosFn.auth('post', 'create-staff', {
         name: '길동홍',
         gender: 'M',
         birth: '19960314',
         tel: '01012344321',
         address: '집',
         adminYN: null,
         enrollDate: '20230101',
         deptCode: 'NO',
      });
      expect(result).toBe('이름 입력오류');
      // const result = axiosFn('post', 'auth/create-staff/', {
      //    gender: 'M',
      //    birth: 19960314,
      //    tel: '01012344321',
      //    address: '집',
      //    adminYN: null,
      //    enrollDate: 20230101,
      //    deptCode: 'NO',
      // });
      // expect(result).toThrow();
   });

   test('tes1t', async () => {
      const result = axiosFn.add('abc', 'def');
      expect(result).toBe('abcdef');
   });
});
//    test('staffId가 값을 포함', () => {
//       expect(
//          axios(
//             createConfig('post', 'create-staff', {
//                staffId: '230410003',
//                name: '홍길동',
//                gender: 'M',
//                birth: 19960314,
//                tel: '01012344321',
//                address: '집',
//                adminYN: null,
//                enrollDate: 20230101,
//                deptCode: 'NO',
//             })
//          )
//       ).toThrow();
//    });

//    test('name에 한글이 아닌 다른 문자(글자)가 포함', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('password가 값을 포함', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('gender 미입력', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('gender가 M또는 F가 아닌 다른 문자', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('birth 미입력', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('birth 양식 오류(숫자 8자 미만)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('birth 양식 오류(숫자 8자 초과)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('birth 양식 오류(숫자가 아닌 문자입력)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('birth가 현재날짜이거나, 이후의 날짜', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('tel 양식 오류(숫자 11자 미만)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('tel 양식 오류(숫자 12자 초과)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('tel 양식 오류(숫자가 아닌 문자입력)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('tel 양식 오류(시작이 0이 아닌 수 입력)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('tel 양식 오류(4번째 자리가 0)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('adminYN 미입력', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('adminYN이 Y또는 N이 아닌 다른 문자', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('enrollDate 미입력 (자동생성됨)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('enrollDate 양식 오류(숫자 8자 미만)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('enrollDate 양식 오류(숫자 8자 초과)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('enrollDate 양식 오류(숫자가 아닌 문자입력)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('leaveDate가 입력된 경우 (Null로 자동생성)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });
//    test('deptCode 양식 오류 (RS, HK, FO, FC, FB, NO중 하나가 아닌 문자입력)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });
//    test('deptCode 미입력 (NO로 자동입력됨)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });
// });

// describe('Auth - EditStaff', () => {
//    test('staffId값 Null', () => {
//       expect(authController.resetPassword({}).toStrictEqual());
//    });

//    test('staffId와 일치하는 값이 없음', () => {
//       expect(authController.resetPassword({}).toStrictEqual());
//    });

//    test('name에 한글이 아닌 다른 문자(글자)가 포함', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('gender 미입력', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('gender가 M또는 F가 아닌 다른 문자', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('birth 미입력', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('birth 양식 오류(숫자 8자 미만)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('birth 양식 오류(숫자 8자 초과)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('birth 양식 오류(숫자가 아닌 문자입력)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('birth가 현재날짜이거나, 이후의 날짜', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('tel 양식 오류(숫자 11자 미만)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('tel 양식 오류(숫자 12자 초과)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('tel 양식 오류(숫자가 아닌 문자입력)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('tel 양식 오류(시작이 0이 아닌 수 입력)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('tel 양식 오류(4번째 자리가 0)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('adminYN 미입력', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('adminYN이 Y또는 N이 아닌 다른 문자', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('enrollDate 미입력 (자동생성됨)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('enrollDate 양식 오류(숫자 8자 미만)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('enrollDate 양식 오류(숫자 8자 초과)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('enrollDate 양식 오류(숫자가 아닌 문자입력)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('leaveDate 양식 오류(숫자 8자 미만)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('leaveDate 양식 오류(숫자 8자 초과)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('leaveDate 양식오류(숫자가 아닌 문자입력)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('deptCode 양식 오류 (RS, HK, FO, FC, FB, NO중 하나가 아닌 문자입력)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('deptCode 미입력 (NO로 자동입력됨)', () => {
//       expect(authController.createStaff({}).toStrictEqual());
//    });

//    test('', () => {
//       expect(authController.editStaff({}).toStrictEqual());
//    });
// });

// describe('Auth - ResetPassword', () => {
//    test('staffId값 Null', () => {
//       expect(authController.resetPassword({}).toStrictEqual());
//    });
//    test('staffId와 일치하는 값이 없음', () => {
//       expect(authController.resetPassword({}).toStrictEqual());
//    });
// });

// describe('Auth - EditPassword', () => {
//    test('staffId값 Null', () => {
//       expect(authController.resetPassword({}).toStrictEqual());
//    });
//    test('staffId와 일치하는 값이 없음', () => {
//       expect(authController.resetPassword({}).toStrictEqual());
//    });
//    test('password 오입력', () => {
//       expect(authController.editStaff({}).toStrictEqual());
//    });
// });

// describe('Auth - Login', () => {
//    test('staffId값 Null', () => {
//       expect(authController.login({}).toStrictEqual());
//    });
//    test('staffId와 일치하는 값이 없음', () => {
//       expect(authController.login({}).toStrictEqual());
//    });
//    test('password 오입력', () => {
//       expect(authController.login({}).toStrictEqual());
//    });
// });

// describe('Auth - DeleteStaff', () => {
//    test('staffId값 Null', () => {
//       expect(authController.resetPassword({}).toStrictEqual());
//    });
//    test('staffId와 일치하는 값이 없음', () => {
//       expect(authController.resetPassword({}).toStrictEqual());
//    });
// });
