import * as dotenv from 'dotenv';
dotenv.config();

export const Config = {
   development: {
      username: 'root',
      password: 'Tjdgnsqkqh12!',
      database: 'PmsProject',
      host: '127.0.0.1',
      dialect: 'mysql',
   },
   production: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
      port: process.env.DB_PORT,
   },
};
