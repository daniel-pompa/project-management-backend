import mongoose, { Schema, Document, Types, PopulatedDoc } from 'mongoose';
import Task, { ITask } from './Task';
import { IUser } from './User';
import Note from './Note';

export interface IProject extends Document {
  name: string;
  client: string;
  description: string;
  tasks: PopulatedDoc<ITask & Document>[];
  manager: PopulatedDoc<IUser & Document>;
  team: PopulatedDoc<IUser & Document>[];
}

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    client: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    tasks: [{ type: Types.ObjectId, ref: 'Task' }],
    manager: { type: Types.ObjectId, ref: 'User' },
    team: [{ type: Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// Middleware to delete all tasks associated with a project when the project is deleted
ProjectSchema.pre('deleteOne', { document: true }, async function () {
  const projectId = this._id;
  if (!projectId) return;
  const tasks = await Task.find({ project: projectId });
  if (!tasks) return;
  for (const task of tasks) {
    await Note.deleteMany({ task: task.id });
  }
  await Task.deleteMany({ project: projectId });
});

const Project = mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
