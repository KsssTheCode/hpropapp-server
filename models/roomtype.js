export const RoomType = (sequelize, DataTypes) => {
   const RoomType = sequelize.define(
      'RoomType',
      {
         roomTypeCode: {
            type: DataTypes.STRING(3),
            primaryKey: true,
            commnet: '객실타입코드',
         },
         roomTypeName: {
            type: DataTypes.STRING(50),
            defaultValue: null,
            comment: '객실타입 상세이름',
         },
         roomMaxPeople: {
            type: DataTypes.INTEGER,
            defaultValue: 2,
            commnet: '1객실 최대 수용인원',
         },
         rackRate: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: '객실 고정가',
         },
      },
      {
         paranoid: true,
      }
   );

   RoomType.associate = function (models) {
      RoomType.hasMany(models.Room, {
         foreignKey: { name: 'roomTypeCode', allowNull: true },
         sourceKey: 'roomTypeCode',
      });
      RoomType.hasMany(models.Reservation, {
         foreignKey: { name: 'roomTypeCode', allowNull: false },
         sourceKey: 'roomTypeCode',
      });
      RoomType.hasMany(models.RoomRate, {
         foreignKey: { name: 'roomTypeCode', allowNull: false },
         sourceKey: 'roomTypeCode',
      });
   };

   return RoomType;
};

// import { Model } from 'sequelize';
//
// export const RoomType = (sequelize, DataTypes) => {
//    class RoomType extends Model {
//       /**
//        * Helper method for defining associations.
//        * This method is not a part of Sequelize lifecycle.
//        * The `models/index` file will call this method automatically.
//        */
//       static associate(models) {
//          this.hasMany(models.Room, {
//             foreignKey: { name: 'roomTypeCode', allowNull: true },
//             sourceKey: 'roomTypeCode',
//          });
//          this.hasMany(models.Reservation, {
//             foreignKey: { name: 'roomTypeCode', allowNull: true },
//             sourceKey: 'roomTypeCode',
//             onDelete: 'SET NULL',
//             onUpdate: 'CASCADE',
//          });
//       }
//    }
//    RoomType.init(
//       {
//          roomTypeCode: {
//             type: DataTypes.STRING(3),
//             primaryKey: true,
//             commnet: '객실타입코드',
//          },
//          roomTypeName: {
//             type: DataTypes.STRING(50),
//             defaultValue: null,
//             comment: '객실타입 상세이름',
//          },
//          roomMaxPeople: {
//             type: DataTypes.INTEGER,
//             defaultValue: 0,
//             commnet: '1객실 최대 수용인원',
//          },
//          rackRate: {
//             type: DataTypes.INTEGER,
//             defaultValue: 0,
//             comment: '객실 고정가',
//          },
//       },
//       {
//          sequelize,
//          paranoid: true,
//          modelName: 'RoomType',
//          hooks: {
//             afterDestroy: function (instance, options) {
//                const room = instance.setRoom({ roomTypeCode: null });
//             },
//             afterUpdate: function (instance, options) {
//                instance.setRoom({ roomTypeCode: instance.roomTypeCode });
//             },
//          },
//       }
//    );
//    return RoomType;
// };
