export const Membership = (sequelize, DataTypes) => {
   const Membership = sequelize.define(
      'Membership',
      {
         membershipGrade: {
            type: DataTypes.STRING(1),
            primaryKey: true,
            allowNull: false,
         },
         membershipName: {
            type: DataTypes.STRING(30),
            allowNull: false,
            comment: '등급명',
         },
         discount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '할인율',
         },
         reference: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: '설명',
         },
      },
      {
         modelName: 'Membership',
         timestamps: false,
      }
   );

   Membership.associate = (models) => {
      Membership.hasMany(models.Member, {
         foreignKey: { name: 'membershipGrade', allowNull: true },
         sourceKey: 'membershipGrade',
      });
   };

   return Membership;
};
