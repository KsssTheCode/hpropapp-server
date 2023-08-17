import { afterUpdateHook } from './group-hooks.js';

export const Group = (sequelize, DataTypes) => {
   const Group = sequelize.define(
      'Group',
      {
         groupId: {
            type: DataTypes.STRING(10),
            primaryKey: true,
            allowNull: false,
         },
         groupName: {
            type: DataTypes.STRING(30),
            allowNull: false,
            commnet: '단체명',
         },
         representorName: {
            type: DataTypes.STRING(15),
            comment: '인솔명',
         },
         representorTel: {
            type: DataTypes.STRING(14),
            comment: '예약자 연락처',
         },
         companyName: {
            type: DataTypes.STRING(30),
            comment: '기업명',
         },
         companyTel: {
            type: DataTypes.STRING(14),
            comment: '기업 연락처',
         },
         companyAddress: {
            type: DataTypes.STRING(60),
            comment: '회사 주소',
         },
         reference: {
            type: DataTypes.STRING(900),
            comment: '특이사항',
         },
         changeHistory: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: '[]',
            commnet: '변경기록',
         },
      },
      {
         sequelize,
         paranoid: true,
      }
   );

   Group.associate = (models) => {
      // Group.belongsTo(models.Account, {
      //    foreignKey: { name: 'groupId', allowNull: true },
      //    targetKey: 'groupId',
      // });
      Group.hasMany(models.GroupReservation, {
         foreignKey: { name: 'groupId', allowNull: true },
         sourceKey: 'groupId',
      });
      Group.hasMany(models.Memo, {
         foreignKey: { name: 'groupId', allowNull: true },
         sourceKey: 'groupId',
      });
      Group.hasMany(models.CustomerChangeHistory, {
         foreignKey: { name: 'groupId', allowNull: true },
         sourceKey: 'groupId',
      });
   };

   Group.addHook('afterUpdate', afterUpdateHook);

   return Group;
};
