import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IToken extends Document {
  authToken: string;
  user: Types.ObjectId;
  createdAt: Date;
}

const tokenSchema = new Schema({
  authToken: { type: String, required: true },
  user: { type: Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now, expires: '10m' },
});

const token = mongoose.model<IToken>('Token', tokenSchema);

export default token;
