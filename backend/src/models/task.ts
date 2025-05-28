import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  taskName: string;
  assignee: string;
  dueDate: Date;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    taskName: {
      type: String,
      required: true,
      trim: true,
    },
    assignee: {
      type: String,
      required: true,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ['P1', 'P2', 'P3', 'P4'],
      default: 'P3',
    },
  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.model<ITask>('Task', TaskSchema); 