export const getRateTypesDataForFilterSelectionDAO = async () => {
   try {
      return await RateType.findAll({
         attributes: ['rateTypeCode'],
         where: { deletedAt: null },
      }).catch(() => {
         throw createError(500, '요금책정형식 조회 중 DB에서 오류발생');
      });
   } catch (err) {
      throw err;
   }
};
