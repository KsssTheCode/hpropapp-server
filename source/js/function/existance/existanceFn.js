import db from '../../../../models/index.js';
import nations from 'i18n-iso-countries';
import { createError } from '../commonFn.js';
import { Op } from 'sequelize';
import { countRecords } from '../commonFn.js';

export const checkExistingRoomType = async (roomTypeCode) => {
   const isExistingRoomType = await db.RoomType.findByPk(roomTypeCode, {
      returning: true,
   }).catch(() => {
      throw createError(500, '객실타입조회 중 DB에서 오류 발생');
   });
   return isExistingRoomType;
};

export const checkNumberOfGuestsInRange = (roomTypeData, numberOfGuests) => {
   if (numberOfGuests) {
      if (roomTypeData.getDataValue('roomMaxPeople') < numberOfGuests)
         throw createError(400, '객실당 수용인원 초과');
   }
};

export const checkExistingDeptCode = async (deptCode) => {
   const isExistingdeptCode = await db.Department.findByPk(deptCode, {
      returning: true,
   }).catch(() => {
      throw createError(500, '부서코드 조회 중 DB에서 오류발생');
   });
   return isExistingdeptCode;
};

export const checkExistingRateType = async (rateTypeCode) => {
   const isExistingRateType = await db.RateType.findByPk(rateTypeCode, {
      returning: true,
   }).catch(() => {
      throw createError(500, '요금책정형식 조회 중 DB에서 오류발생');
   });
   return isExistingRateType;
};

export const checkAssignedRoom = async (roomNumber, arrDate, depDate) => {
   const assignedRoom = await db.Reservation.findAll({
      where: {
         roomNumber: roomNumber,
         arrivalDate: { [Op.lt]: depDate },
         departureDate: { [Op.gt]: arrDate },
      },
   });

   return assignedRoom;
};

/** (취소된 예약 제외)존재하는 예약일 시, 해당 id를 가진 예약 객체를 return */
export const checkExistingRsvn = async (id) => {
   const isExistingRsvn = await db.Reservation.findByPk(id, {
      where: { [Op.not]: 'CX' },
      returning: true,
   }).catch(() => {
      throw createError(500, '예약조회 중 DB에서 오류발생');
   });
   return isExistingRsvn;
};

export const checkAvailableRsvnStatus = async (modelName, id, status) => {
   let model;
   if (modelName.toLowerCase() === 'reservation') model = db.Reservation;
   if (modelName.toLowerCase() === 'groupreservation')
      model = db.GroupReservation;
   const currentStatus = await model
      .findByPk(id, { attributes: ['statusCode'] }, { returning: true })
      .catch(() => {
         throw createError(500, '예약 상태값 조회 중 DB에서 오류발생');
      });

   switch (currentStatus) {
      case 'CX':
         if (status !== 'RR') throw createError(400, '변경불가한 예약 상태');
      case 'RR':
         if (status === 'HC' || status === 'CO')
            throw createError(400, '변경 불가한 예약 상태');
      case 'CI':
         if (status === 'CX') throw createError(400, '변경불가한 예약 상태');
      case 'HC':
         if (status === 'CX' || status === 'RR')
            throw createError(400, '변경불가한 예약상태');
      case 'CO':
         if (status === 'CX' || status === 'RR')
            throw createError(400, '변경불가한 예약상태');
   }
};

export const checkExistingMemo = async (memoId) => {
   const isExistingMemo = await db.Memo.findByPk(memoId, {
      returning: true,
   }).catch(() => {
      throw createError(500, '메모조회 중 DB에서 오류발생');
   });
   return isExistingMemo;
};

export const checkExistingStaff = async (staffId) => {
   const isExistingStaff = await db.Staff.findByPk(staffId, {
      where: { leaveDate: null },
   }).catch(() => {
      throw createError(500, '직원조회 중 DB에서 오류발생');
   });
   return isExistingStaff;
};

export const checkExistingRoomNumber = async (roomNumber) => {
   try {
      const existingRoomNumber = await db.Room.findOne({
         where: { roomNumber: roomNumber },
         returning: true,
      });

      return existingRoomNumber;
   } catch (err) {
      throw createError(500, '객실조회 중 DB에서 오류발생');
   }
};

//[isExistingRooms, notExistingRooms]를 결과값으로 Return하는 함수
export const checkExistingRoomNumbers = async (roomNumbers) => {
   //reverse값이 true라면 , available에 존재하는 객실번호    /unavailable에 이미 존재하지 않는 객실번호
   //reverse값이 false라면, available에 존재하지 않는 객실번호/unavailable에 이미 존재하는 객실번호     create
   try {
      const isExistingRooms = [];
      const notExistingRooms = [];

      const roomsExisting = await db.Room.findAll({
         where: { roomNumber: { [db.Sequelize.Op.in]: roomNumbers } },
         returning: true,
      });

      const existingRoomNumbers = [];
      roomsExisting.forEach((room) => {
         existingRoomNumbers.push(room.roomNumber);
      });

      roomNumbers.forEach((roomNumber) => {
         existingRoomNumbers.includes(roomNumber)
            ? isExistingRooms.push(roomNumber)
            : notExistingRooms.push(roomNumber);
      });

      return { isExistingRooms, notExistingRooms };
   } catch (err) {
      throw createError(500, '객실조회 중 DB에서 오류발생');
   }
};

export const checkExistingNation = (nationCode) => {
   const nationCodes = Object.keys(nations.getAlpha2Codes());
   const isCodeExisting = nationCodes.includes(nationCode);
   if (!isCodeExisting) throw createError(400, '존재하지 않는 국가코드');
};

export const checkExistingMember = async (memberId) => {
   const isExistingMember = await db.Member.findByPk(memberId, {
      returning: true,
   }).catch(() => {
      throw createError(500, '고객 조회 중 DB에서 오류발생');
   });
   return isExistingMember;
};

export const checkExistingMembershipGrade = async (membershipGrade) => {
   const isExistingGrade = await db.Membership.findByPk(membershipGrade, {
      returning: true,
   }).catch(() => {
      throw createError(500, '멤버십 조회 중 DB에서 오류발생');
   });
   return isExistingGrade;
};

export const checkExistingRoomRate = async (roomRateId) => {
   const isExistingRoomRate = await db.RoomRate.findByPk(roomRateId, {
      returning: true,
   }).catch(() => {
      throw createError(500, '객실료 조회 중 DB에서 오류발생');
   });
   return isExistingRoomRate;
};

export const checkExistingGroup = async (groupId) => {
   const isExistingGroupId = await db.Group.findByPk(groupId, {
      returning: true,
   }).catch(() => {
      throw createError(500, '단체 조회 중 DB에서 오류발생');
   });
   return isExistingGroupId;
};

export const checkExistingGroupByName = async (groupName) => {
   const isExistingGroupName = await db.Group.findOne({
      where: { groupName: groupName },
      returning: true,
   }).catch(() => {
      throw createError(500, '그룹명 조회 중 DB에서 오류발생');
   });
   return isExistingGroupName;
};

// export const checkExistingGroup = async (groupName, groupId) => {
//    const isExistingGroup = await db.Group.findOne({
//       where: { [Op.or]: [{ groupName: groupName }, { groupId: groupId }] },
//    }).catch(() => {
//       throw createError(500, '그룹명 조회 중 DB에서 오류발생');
//    });
//    return isExistingGroup;
// };

export const checkExistingFloor = async (floor) => {
   const isExistingFloor = await db.Floor.findByPk(floor).catch(() => {
      throw createError(500, '층 조회 중 DB에서 오류발생');
   });
   return isExistingFloor;
};

export const checkExistingCleanStatusCode = async (cleanStatusCode) => {
   const isExistingCleanStatus = await db.CleanStatus.findByPk(
      cleanStatusCode
   ).catch(() => {
      throw createError(500, '정비상태코드 조회 중 DB에서 오류발생');
   });
   return isExistingCleanStatus;
};

export const checkExistingTel = async (tel) => {
   const isExistingTel = await db.Member.findOne({
      where: { tel: tel },
   }).catch(() => {
      throw createError(500, '고객 연락처 조회 중 DB에서 오류발생');
   });
   return isExistingTel;
};

export const checkAvailablePage = async (page, itemsInOnePage) => {
   const memberCounts = await countRecords('Member');
   if (+memberCounts / +itemsInOnePage > +page)
      throw createError(400, '존재하지 않는 페이지');
};

export const checkExistingDailyRate = async (id) => {
   const isExistingDailyRate = await db.DailyRate.findByPk(id, {
      returning: true,
   }).catch(() => {
      throw createError(500, '일별요금 호출 중 DB에서 오류발생');
   });
   return isExistingDailyRate;
};

export const checkExistingGroupRsvn = async (id) => {
   const isExistingGroupRsvn = await db.GroupReservation.findByPk(id, {
      returning: true,
   }).catch(() => {
      throw createError(500, '단체예약 조회 중 DB에서 오류발생');
   });
   return isExistingGroupRsvn;
};
