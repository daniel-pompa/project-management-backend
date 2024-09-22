import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whitelist = [process.env.REACT_APP_FRONTEND_URL];
    /** Allow undefined origin to fix CORS error in Thunder Client or Postman */
    if (process.argv[2] === '--api') {
      whitelist.push(undefined);
    }
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
