import { useState } from 'react';
import { format } from 'date-fns';
import { Task, UpdateTaskInput } from '@/types/task';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '@/services/api';
import toast from 'react-hot-toast';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const queryClient = useQueryClient();
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<UpdateTaskInput>({});

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      taskApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setEditingTask(null);
      toast.success('Task updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update task');
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete task');
    },
  });

  const handleEdit = (task: Task) => {
    setEditingTask(task._id);
    setEditForm({
      taskName: task.taskName,
      assignee: task.assignee,
      dueDate: task.dueDate,
      priority: task.priority,
    });
  };

  const handleUpdate = (id: string) => {
    updateTaskMutation.mutate({ id, data: editForm });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1':
        return 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200';
      case 'P2':
        return 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200';
      case 'P3':
        return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200';
      case 'P4':
        return 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200';
      default:
        return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200';
    }
  };

  return (
    <div className="flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-secondary-300 dark:divide-secondary-700">
            <thead>
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-secondary-900 dark:text-secondary-100 sm:pl-0">
                  Task
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-secondary-900 dark:text-secondary-100">
                  Assigned To
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-secondary-900 dark:text-secondary-100">
                  Due Date/Time
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-secondary-900 dark:text-secondary-100">
                  Priority
                </th>
                <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-secondary-900 dark:text-secondary-100 sm:pl-0">
                    {editingTask === task._id ? (
                      <input
                        type="text"
                        value={editForm.taskName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, taskName: e.target.value })
                        }
                        className="block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-secondary-600 dark:bg-secondary-700 dark:text-white sm:text-sm"
                      />
                    ) : (
                      task.taskName
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-secondary-500 dark:text-secondary-400">
                    {editingTask === task._id ? (
                      <input
                        type="text"
                        value={editForm.assignee}
                        onChange={(e) =>
                          setEditForm({ ...editForm, assignee: e.target.value })
                        }
                        className="block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-secondary-600 dark:bg-secondary-700 dark:text-white sm:text-sm"
                      />
                    ) : (
                      task.assignee
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-secondary-500 dark:text-secondary-400">
                    {editingTask === task._id ? (
                      <input
                        type="datetime-local"
                        value={editForm.dueDate}
                        onChange={(e) =>
                          setEditForm({ ...editForm, dueDate: e.target.value })
                        }
                        className="block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-secondary-600 dark:bg-secondary-700 dark:text-white sm:text-sm"
                      />
                    ) : (
                      format(new Date(task.dueDate), 'PPp')
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    {editingTask === task._id ? (
                      <select
                        value={editForm.priority}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            priority: e.target.value as 'P1' | 'P2' | 'P3' | 'P4',
                          })
                        }
                        className="block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-secondary-600 dark:bg-secondary-700 dark:text-white sm:text-sm"
                      >
                        <option value="P1">P1</option>
                        <option value="P2">P2</option>
                        <option value="P3">P3</option>
                        <option value="P4">P4</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    )}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    {editingTask === task._id ? (
                      <button
                        onClick={() => handleUpdate(task._id)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        Save
                      </button>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="text-secondary-400 hover:text-secondary-500 dark:text-secondary-500 dark:hover:text-secondary-400"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => deleteTaskMutation.mutate(task._id)}
                          className="text-error-400 hover:text-error-500 dark:text-error-500 dark:hover:text-error-400"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 