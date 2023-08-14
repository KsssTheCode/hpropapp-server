import Sequelize from 'sequelize';
import { DataTypes } from 'sequelize';
import { Floor } from './floor.js';
import { Department } from './department.js';
import { RoomRate } from './roomRate.js';
import { RoomType } from './roomType.js';
import { Room } from './room.js';
import { RoomStatus } from './roomStatus.js';
import { RateType } from './rateType.js';
import { Membership } from './membership.js';
import { Member } from './member.js';
import { Group } from './group.js';
import { Staff } from './staff.js';
import { GroupReservation } from './groupReservation.js';
import { Reservation } from './reservation.js';
import { Folio } from './folio.js';
import { Memo } from './memo.js';
import { CleanStatus } from './cleanStatus.js';
import { ReservationStatus } from './reservationStatus.js';
import { DailyRate } from './dailyRate.js';
import { ReservationChangeHistory } from './reservationChangeHistory.js';
import { Config } from '../../config/config.js';
import * as dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV || 'development';
const config = Config[env];

const db = {};

const sequelize = new Sequelize(
   config.database,
   config.username,
   config.password,
   config
);

db.Floor = Floor(sequelize, DataTypes);
db.RoomType = RoomType(sequelize, DataTypes);
db.Room = Room(sequelize, DataTypes);
db.RoomStatus = RoomStatus(sequelize, DataTypes);
db.Staff = Staff(sequelize, DataTypes);
db.GroupReservation = GroupReservation(sequelize, DataTypes);
db.Reservation = Reservation(sequelize, DataTypes);
db.Folio = Folio(sequelize, DataTypes);
db.Department = Department(sequelize, DataTypes);
db.Memo = Memo(sequelize, DataTypes);
db.RateType = RateType(sequelize, DataTypes);
db.RoomRate = RoomRate(sequelize, DataTypes);
db.Member = Member(sequelize, DataTypes);
db.Group = Group(sequelize, DataTypes);
db.Membership = Membership(sequelize, DataTypes);
db.CleanStatus = CleanStatus(sequelize, DataTypes);
db.ReservationStatus = ReservationStatus(sequelize, DataTypes);
db.DailyRate = DailyRate(sequelize, DataTypes);
db.ReservationChangeHistory = ReservationChangeHistory(sequelize, DataTypes);

Object.keys(db).forEach((modelName) => {
   if (db[modelName].associate) {
      db[modelName].associate(db);
   }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
