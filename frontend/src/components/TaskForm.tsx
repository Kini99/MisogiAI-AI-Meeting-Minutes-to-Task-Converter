import { useForm } from 'react-hook-form';
import { CreateTaskInput } from '@/types/task';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '@/services/api';
import toast from 'react-hot-toast';

export default function TaskForm() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<CreateTaskInput>();

  const createTaskMutation = useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      reset();
      toast.success('Task created successfully!');
    },
    onError: (err) => {
      console.log(err)
      toast.error('Failed to create task');
    },
  });

  const onSubmit = (data: CreateTaskInput) => {
    createTaskMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="task"
          className="block text-sm font-medium text-secondary-700 dark:text-secondary-200"
        >
          Enter Task
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="task"
            {...register('text', { required: true })}
            className="block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-secondary-600 dark:bg-secondary-700 dark:text-white sm:text-sm p-3"
            placeholder="e.g., Finish landing page Aman by 11pm 20th June"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={createTaskMutation.isPending}
        className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {createTaskMutation.isPending ? 'Creating...' : 'Add Task'}
      </button>
    </form>
  );
} 