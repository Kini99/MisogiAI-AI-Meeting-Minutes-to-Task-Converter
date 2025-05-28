import { Request, Response } from 'express';
import { Task } from '../models/Task';
import { parseTasksFromTranscript } from '../services/geminiService';

export const taskController = {
  parseTranscript: async (req: Request, res: Response) => {
    try {
      const { transcript } = req.body;

      if (!transcript) {
        return res.status(400).json({ error: 'Transcript is required' });
      }

      const parsedTasks = await parseTasksFromTranscript(transcript);
      const tasks = await Promise.all(
        parsedTasks.map(async (task) => {
          const newTask = new Task({
            ...task,
            dueDate: new Date(task.dueDate),
          });
          return await newTask.save();
        })
      );

      res.status(201).json(tasks);
    } catch (error) {
      console.error('Error parsing transcript:', error);
      res.status(500).json({ error: 'Failed to parse transcript' });
    }
  },

  getTasks: async (_req: Request, res: Response) => {
    try {
      const tasks = await Task.find().sort({ createdAt: -1 });
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  },

  updateTask: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Convert dueDate to Date object if it's provided
      if (updates.dueDate) {
        updates.dueDate = new Date(updates.dueDate);
      }

      const task = await Task.findByIdAndUpdate(id, updates, { new: true });
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(task);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  },

  deleteTask: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const task = await Task.findByIdAndDelete(id);
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  },
}; 