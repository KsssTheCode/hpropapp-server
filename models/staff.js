import { STAFF_ROLE } from '../constants/role.js';

export const Staff = (sequelize, DataTypes) => {
   const Staff = sequelize.define(
      'Staff',
      {
         staffId: {
            type: DataTypes.STRING(9),
            primaryKey: true,
            allowNull: false,
            comment: '사번',
         },
         password: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: '비밀번호',
         },
         name: {
            type: DataTypes.STRING(30),
            allowNull: false,
            comment: '사원명',
         },
         gender: {
            type: DataTypes.STRING(1),
            allowNull: false,
            comment: '성별',
         },
         birth: {
            type: DataTypes.STRING(8),
            comment: '생년월일',
         },
         tel: {
            type: DataTypes.STRING(14),
            comment: '연락처',
         },
         address: {
            type: DataTypes.STRING,
            comment: '주소',
         },
         adminYN: {
            type: DataTypes.STRING(1),
            allowNull: false,
            defaultValue: 'N',
            comment: '관리자여부',
         },
         enrollDate: {
            type: DataTypes.STRING(8),
            allowNull: false,
            comment: '입사일',
         },
         leaveDate: {
            type: DataTypes.STRING(8),
            defaultValue: null,
            comment: '퇴사일',
         },
         createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.fn('NOW'),
         },
         changeHistory: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: '[]',
            commnet: '변경기록',
         },
         role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: STAFF_ROLE.MANAGER,
         },
      },
      {
         sequelize,
         modelName: 'Staff',
      }
   );

   Staff.associate = (models) => {
      Staff.belongsTo(models.Department, {
         foreignKey: { name: 'deptCode', allowNull: false },
         targetKey: 'deptCode',
         onDelete: 'SET DEFAULT',
         onUpdate: 'CASCADE',
      });
      Staff.hasOne(models.Reservation, {
         foreignKey: { name: 'createStaffId', allowNull: false },
         sourceKey: 'staffId',
      });
      Staff.hasMany(models.GroupReservation, {
         foreignKey: { name: 'createStaffId', allowNull: false },
         sourceKey: 'staffId',
      });
   };

   return Staff;
};
