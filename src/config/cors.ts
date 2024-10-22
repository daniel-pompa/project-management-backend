import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    // Allow all origins in development
    if (process.env.NODE_ENV !== 'production') {
      callback(null, true);
      return;
    }
    /** Allow undefined origin to fix CORS error in Thunder Client or Postman */
    const whitelist = [process.env.REACT_APP_FRONTEND_URL];
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
