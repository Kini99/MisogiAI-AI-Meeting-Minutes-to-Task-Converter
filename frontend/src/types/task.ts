export interface Task {
  _id: string;
  taskName: string;
  assignee: string;
  dueDate: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  text: string;
}

export interface UpdateTaskInput {
  taskName?: string;
  assignee?: string;
  dueDate?: string;
  priority?: 'P1' | 'P2' | 'P3' | 'P4';
} 