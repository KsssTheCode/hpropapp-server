import * as authService from '../service/authService.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res, next) => {
   try {
      const { staffId, password } = req.body;

      console.log(req.body);

      const response = await authService.logInService(staffId, password);

      const token = jwt.sign(
         {
            role: response.role,
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
      });

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const extendLoginState = async (req, res, next) => {
   try {
      const { staffId, password } = req.body;

      const response = await authService.logInService(staffId, password);

      const token = jwt.sign(
         {
            role: response.role,
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
      });

      res.status(200).json(response);
   } catch (err) {
      next(err);
   }
};

export const logout = (req, res, next) => {
   res.clearCookie('access_token');
   res.clearCookie('staffId');
   res.status(200).send('로그아웃 완료');
};
