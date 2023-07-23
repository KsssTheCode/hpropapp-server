export const CleanStatus = (sequelize, DataTypes) => {
   const CleanStatus = sequelize.define(
      'CleanStatus',
      {
         cleanStatusCode: {
            type: DataTypes.STRING(2),
            primaryKey: true,
            allowNull: false,
            comment: '정비상태',
         },
         statusName: {
            type: DataTypes.STRING,
            comment: '객실상태명',
         },
      },
      {
         timestamps: false,
      }
   );
   CleanStatus.associate = (models) => {
      CleanStatus.hasMany(models.Room, {
         foreignKey: { name: 'cleanStatusCode', allowNull: false },
         sourceKey: 'cleanStatusCode',
      });
   };

   return CleanStatus;
};
