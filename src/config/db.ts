import mongoose from 'mongoose';
import 'colors';

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.DATABASE_CONNECTION!);
    const url = `${connection.host}:${connection.port}`;
    console.log(`MongoDB Connected: ${url}`.blue);
  } catch (error) {
    console.error('Database connection error'.red);
    process.exit(1);
  }
};
