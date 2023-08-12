import { getChangeHistoryMessage } from '../source/js/function/commonFn.js';

export const Member = (sequelize, DataTypes) => {
   const Member = sequelize.define(
      'Member',
      {
         memberId: {
            type: DataTypes.STRING(10),
            primaryKey: true,
            allowNull: false,
         },
         name: {
            type: DataTypes.STRING(30),
            allowNull: false,
            comment: '고객명',
         },
         gender: {
            type: DataTypes.STRING(1),
            allowNull: true,
            comment: '성별',
         },
         birth: {
            type: DataTypes.STRING(8),
            allowNull: true,
            comment: '생년월일',
         },
         tel: {
            type: DataTypes.STRING(14),
            comment: '연락처',
         },
         address: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: '주소',
         },
         nationality: {
            type: DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'KO',
            comment: '국적',
         },
         carNumber: {
            type: DataTypes.STRING(8),
            allowNull: true,
            comment: '차량번호',
         },
         blackListYN: {
            type: DataTypes.STRING(1),
            allowNull: false,
            defaultValue: 'N',
            comment: '블랙리스트여부',
         },
         reference: {
            type: DataTypes.STRING,
            allowNull: true,
            commnet: '비고',
         },
         changeHistory: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: '회원 변경기록',
         },
      },
      {
         modelName: 'Member',
         paranoid: true,
         hooks: {
            afterUpdate: async (member, options) => {
               const newHistory = getChangeHistoryMessage(
                  member.previous(),
                  member,
                  ['memberId']
               );

               await db.models.Member.update(
                  {
                     changeHistory: db.Sequelize.fn(
                        'JSON_ARRAY_APPEND', //사용할 함수 이름
                        db.Sequelize.col('changeHistory'), //history를 속성컬럼으로 지정
                        '$', //JSON배열 마지막에 새로운 요소를 추가하도록 함 (루트객체 의미)
                        JSON.stringify(newHistory) //추가할 객체
                     ),
                  },
                  {
                     where: { memberId: member.memberId },
                     transaction: options.transaction,
                  }
               ).catch(() => {
                  throw createError(
                     500,
                     '회원변경기록 수정 중 DB에서 오류발생'
                  );
               });
            },
         },
      }
   );

   Member.associate = (models) => {
      Member.hasMany(models.Reservation, {
         foreignKey: { name: 'memberId', allowNull: true },
         sourceKey: 'memberId',
      });
      Member.hasMany(models.Memo, {
         foreignKey: { name: 'memberId', allowNull: true },
         sourceKey: 'memberId',
      });
      Member.belongsTo(models.Membership, {
         foreignKey: { name: 'membershipGrade', allowNull: true },
         targetKey: 'membershipGrade',
         onDelete: 'CASCADE',
         onUpdate: 'CASCADE',
      });
   };

   return Member;
};
