import { getChangeHistoryMessage } from '../source/js/function/commonFn.js';

export const Memo = (sequelize, DataTypes) => {
   const Memo = sequelize.define(
      'Memo',
      {
         memoTitle: {
            type: DataTypes.STRING(60),
            allowNull: false,
            comment: '메모 제목',
         },
         memoContent: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: '메모 내용',
         },
         confirmYN: {
            type: DataTypes.STRING(1),
            allowNull: true,
            defaultValue: 'N',
            comment: '진행상태 (N: 확인 중, Y:완료)',
         },
         changeHistory: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: '변경기록',
         },
      },
      {
         paranoid: true,
         updatedAt: false,
         hooks: {
            afterUpdate: async (memo, options) => {
               const newHistory = getChangeHistoryMessage(
                  memo.previous(),
                  memo,
                  ['memoId']
               );

               await db.models.Memo.update(
                  {
                     changeHistory: db.Sequelize.fn(
                        'JSON_ARRAY_APPEND', //사용할 함수 이름
                        db.Sequelize.col('changeHistory'), //history를 속성컬럼으로 지정
                        '$', //JSON배열 마지막에 새로운 요소를 추가하도록 함 (루트객체 의미)
                        JSON.stringify(newHistory) //추가할 객체
                     ),
                  },
                  {
                     where: { memoId: memo.memoId },
                     transaction: options.transaction,
                  }
               ).catch(() => {
                  throw createError(
                     500,
                     '메모 변경기록 수정 중 DB에서 오류발생'
                  );
               });
            },
         },
      }
   );

   Memo.associate = (models) => {
      Memo.belongsTo(models.Staff, {
         foreignKey: { name: 'createStaffId', allowNull: false },
         targetKey: 'staffId',
         onDelete: 'NO ACTION',
      });
      Memo.belongsTo(models.Reservation, {
         foreignKey: { name: 'rsvnId', allowNull: true },
         targetKey: 'rsvnId',
      });
      Memo.belongsTo(models.GroupReservation, {
         foreignKey: { name: 'groupRsvnId', allowNull: true },
         targetKey: 'groupRsvnId',
      });
      Memo.belongsTo(models.Member, {
         foreignKey: { name: 'memberId', allowNull: true },
         targetKey: 'memberId',
      });
      Memo.belongsTo(models.Group, {
         foreignKey: { name: 'groupId', allowNull: true },
         targetKey: 'groupId',
      });
   };

   return Memo;
};
