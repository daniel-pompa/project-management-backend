import mongoose, { Schema, Document, Types, PopulatedDoc } from 'mongoose';
import { ITask } from './Task';

export interface IProject extends Document {
  name: string;
  client: string;
  description: string;
  tasks: PopulatedDoc<ITask & Document>[];
}

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    client: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    tasks: [{ type: Types.ObjectId, ref: 'Task' }],
  },
  { timestamps: true }
);

const Project = mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
