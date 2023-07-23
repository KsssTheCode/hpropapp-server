export const Floor = (sequelize, DataTypes) => {
   const Floor = sequelize.define(
      'Floor',
      {
         floorNumber: {
            type: DataTypes.STRING(2),
            primaryKey: true,
            comment: '층',
         },
      },
      {
         timestamps: false,
         modelName: 'Floor',
      }
   );

   Floor.associate = function (models) {
      Floor.hasMany(models.Room, {
         foreignKey: { name: 'floorNumber', allowNull: true },
         sourceKey: 'floorNumber',
      });
   };

   return Floor;
};
