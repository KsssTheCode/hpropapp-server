import { checkAvailablePage } from '../../source/js/function/existance/existanceFn.js';

export const pageExistanceOnly = async (req, res, next) => {
   try {
      const { page, itemsInOnePage } = req.body;
      if (page > 1) checkAvailablePage(page, itemsInOnePage);
      next();
   } catch (err) {
      next(err);
   }
};
