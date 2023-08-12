import { getSelectedRsvnDAO } from '../data-access/reservationDAO.js';

export const getSelectedRsvnService = async (id) => {
   try {
      const { rsvnData, roomRatesData } = await getSelectedRsvnDAO(id);

      const responseData = {
         ...rsvnData.get(),
         RoomRates: roomRatesData.map((roomRate) => roomRate.get()),
      };

      return responseData;
   } catch (err) {
      throw err;
   }
};
