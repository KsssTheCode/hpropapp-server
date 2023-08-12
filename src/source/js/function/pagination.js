import { createError } from '../commonFn.js';
import db from '../../../../models/index.js';

export const paginationExistance = async (groupName, page, itemsInOnePage) => {
   let model;
   switch (groupName) {
      case 'Member':
         model = db.Member;
         break;
      case 'Group':
         model = db.Group;
         break;
      case 'Staff':
         model = db.Staff;
         break;
      case 'Reservation':
         model = db.Reservation;
         break;
      case 'GroupReservation':
         model = db.GroupReservation;
         break;
   }

   const dataCounts = await model.count();
};
