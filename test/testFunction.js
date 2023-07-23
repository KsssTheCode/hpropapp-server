import axios from 'axios';

// export const axiosFn = (method, uri, data) => {
//    axios({
//       method: method,
//       url: 'localhost:3000/' + uri,
//       data: data,
//    });
// };
export const axiosFn = {
   auth: async (method, uri, data) => {
      try {
         return await axios({
            method: method,
            url: 'http://127.0.0.1:3306/auth/' + uri,
            data: data,
         });
      } catch (err) {
         throw err;
      }
   },

   add: (a, b) => {
      const result = a + b;
      return result;
   },
};
