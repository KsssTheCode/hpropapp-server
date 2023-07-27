// import db from '../models/index.js';
// import {
//    currentDateFormat,
//    createError,
//    getChangeHistoryMessage,
// } from '../source/js/function/commonFn.js';

// export const getChangeHistory = (req, res, next) => {
//    try {
//       const { modelName } = req.body;

//       let model;
//       let primaryKey;
//       switch (modelName.toLowerCase()) {
//          case 'reservation':
//             model = db.Reservation;
//             primaryKey = 'rsvnId';
//             break;
//          case 'groupreservation':
//             model = db.GroupReservation;
//             primaryKey = 'groupRsvnId';
//             break;
//          case 'member':
//             model = db.Member;
//             primaryKey = 'memberId';
//             break;
//          case 'group':
//             model = db.Group;
//             primaryKey = 'groupId';
//             break;
//          case 'memo':
//             model = db.Memo;
//             primaryKey = 'memoId';
//             break;
//          case 'membership':
//             model = db.Membership;
//             primaryKey = 'membershipGrade';
//             break;
//       }

//       const history = getChangeHistoryMessage(model, req,body);

//       res.status(200).json(history);

//    } catch (err) {}
// };
