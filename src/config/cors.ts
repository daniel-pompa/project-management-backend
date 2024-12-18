import { CorsOptions } from 'cors';

// Configure CORS options
export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    // Allow all origins in development
    if (process.env.NODE_ENV !== 'production') {
      callback(null, true);
      return;
    }
    const whitelist = [process.env.REACT_APP_FRONTEND_URL];
    // Allow undefined origin to fix CORS error in Thunder Client or Postman
    if (process.argv[2] === '--api') {
      whitelist.push(undefined);
    }
    // Check if origin is in whitelist
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      // Log CORS errors only in development
      if (process.env.NODE_ENV !== 'production') {
        console.error('CORS error for origin:', origin);
      }
      callback(new Error('Not allowed by CORS'));
    }
  },
};
