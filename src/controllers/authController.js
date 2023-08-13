import db from '../models/index.js';
import { createError } from '../source/js/function/commonFn.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req, res, next) => {
   try {
      const { staffId, password } = req.body;

      const staff = await db.Staff.findByPk(staffId, {
         where: { leaveDate: null },
      }).catch(() => {
         throw createError(500, '직원조회 중 DB에서 오류발생');
      });

      if (!staff) res.status(400).send('로그인 실패');

      if (!bcrypt.compareSync(password, staff.password)) {
         res.status(401);
      }

      const token = jwt.sign(
         {
            role: staff.role,
         },
         process.env.JWT_SECRET, //추후 프론트엔드에서 받아온 토큰을 인증(검사)하기 위한 비공개 키
         { expiresIn: process.env.JWT_EXPIRE_TIME }
      );

      res.cookie('staffId', staffId);
      res.cookie('access_token', 'Bearer ' + token, {
         expires: new Date(Date.now() + 8 * 3600000), //8시간
         secure: true,
         sameSite: 'none',
         httpOnly: true,
         // domain: 'http://localhost:3000',
      });

      res.status(200).json(staffId);
   } catch (err) {
      next(err);
   }
};

export const extendLoginState = async (req, res, next) => {
   try {
      const { staffId, password } = req.body;

      const staff = await db.Staff.findByPk(staffId, {
         where: { leaveDate: null },
      }).catch(() => {
         throw createError(500, '직원조회 중 DB에서 오류발생');
      });

      if (!bcrypt.compareSync(password, staff.password)) {
         res.status(400).send('비밀번호 입력오류');
         return;
      }

      const token = jwt.sign(
         {
            role: staff.role,
         },
         process.env.JWT_SECRET, //추후 프론트엔드에서 받아온 토큰을 인증(검사)하기 위한 비공개 키
         { expiresIn: process.env.JWT_EXPIRE_TIME }
      );

      res.clearCookie('access_token');
      res.cookie('access_token', 'Bearer ' + token, {
         expires: new Date(Date.now() + 8 * 3600000), //8시간
         secure: true,
         sameSite: 'none',
         httpOnly: true,
         // domain: 'http://localhost:3000',
      });

      res.status(200).send('로그인 연장완료');
   } catch (err) {
      next(err);
   }
};

export const logout = (req, res, next) => {
   res.clearCookie('access_token');
   res.clearCookie('staffId');
   res.status(200).send('로그아웃 완료');
};
