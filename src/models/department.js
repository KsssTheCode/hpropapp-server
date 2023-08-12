export const Department = (sequelize, DataTypes) => {
   const Department = sequelize.define(
      'Department',
      {
         deptCode: {
            type: DataTypes.STRING(3),
            primaryKey: true,
            allowNull: false,
            comment: '부서코드',
         },
         deptName: {
            type: DataTypes.STRING(30),
            comment: '부서명',
         },
      },
      {
         sequelize,
         paranoid: true,
         modelName: 'Department',
      }
   );

   Department.associate = function (models) {
      Department.hasMany(models.Staff, {
         foreignKey: { name: 'deptCode', allowNull: false },
         sourceKey: 'deptCode',
      });
   };

   return Department;
};

// import { Model } from 'sequelize';

// export const Department = (sequelize, DataTypes) => {
//    class Department extends Model {
//       static associate(models) {
//          // define association here
//          this.hasMany(models.Staff, {
//             foreignKey: { name: 'deptCode', allowNull: false },
//             sourceKey: 'deptCode',
//          });
//       }
//    }
//    Department.init(
//       {
//          deptCode: {
//             type: DataTypes.STRING(3),
//             primaryKey: true,
//             allowNull: false,
//             comment: '부서코드',
//          },
//          deptName: {
//             type: DataTypes.STRING(30),
//             comment: '부서명',
//          },
//       },
//       {
//          sequelize,
//          paranoid: true,
//          modelName: 'Department',
//       }
//    );
//    return Department;
// };
