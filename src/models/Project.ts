import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  client: string;
  description: string;
}

const ProjectSchema = new Schema({
  name: { type: String, required: true, trim: true },
  client: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
});

const Project = mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
