import axios from 'axios';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/types/task';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const taskApi = {
  createTask: async (input: CreateTaskInput): Promise<Task> => {
    const { data } = await axios.post<Task>(`${API_URL}/api/tasks`, input);
    return data;
  },

  getTasks: async (): Promise<Task[]> => {
    const response = await axios.get<Task[]>(`${API_URL}/api/tasks`);
    return response.data;
  },

  parseTranscript: async (transcript: string): Promise<Task[]> => {
    const response = await axios.post<Task[]>(`${API_URL}/api/tasks/parse-transcript`, { transcript });
    return response.data;
  },

  updateTask: async (taskId: string, updates: Partial<Task>): Promise<Task> => {
    const response = await axios.patch<Task>(`${API_URL}/api/tasks/${taskId}`, updates);
    return response.data;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await axios.delete(`${API_URL}/api/tasks/${taskId}`);
  },
}; 