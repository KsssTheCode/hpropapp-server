export const Folio = (sequelize, DataTypes) => {
   const Folio = sequelize.define(
      'Folio',
      {
         folioId: {
            type: DataTypes.STRING(11),
            primaryKey: true,
            allowNull: false,
         },
         usedItem: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
         },
         paidAmount: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
         },
      },
      {
         freezeTableName: true,
         paranoid: true,
         createdAt: false,
      }
   );

   Folio.associate = (models) => {
      Folio.belongsTo(models.Reservation, {
         foreignKey: {
            name: 'rsvnId',
            allowNull: true,
         },
         targetKey: 'rsvnId',
         onDelete: 'CASCADE',
         onUpdate: 'CASCADE',
      });
      Folio.belongsTo(models.GroupReservation, {
         foreignKey: {
            name: 'groupRsvnId',
            allowNull: true,
         },
         targetKey: 'groupRsvnId',
         onDelete: 'CASCADE',
         onUpdate: 'CASCADE',
      });
   };

   return Folio;
};
