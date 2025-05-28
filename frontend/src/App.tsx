import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { taskApi } from '@/services/api';
import TranscriptForm from '@/components/TranscriptForm';
import TaskList from '@/components/TaskList';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskApi.getTasks,
  });

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900">
      <Toaster position="top-right" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
              MeetingTask
            </h1>
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
              AI-powered meeting transcript parser
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-full p-2 text-secondary-500 hover:text-secondary-600 dark:text-secondary-400 dark:hover:text-secondary-300"
          >
            {darkMode ? (
              <SunIcon className="h-6 w-6" />
            ) : (
              <MoonIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        <div className="bg-white dark:bg-secondary-800 shadow rounded-lg p-6">
          <TranscriptForm />
        </div>

        {isLoading ? (
          <div className="mt-8 text-center text-secondary-500 dark:text-secondary-400">
            Loading tasks...
          </div>
        ) : (
          <div className="mt-8 bg-white dark:bg-secondary-800 shadow rounded-lg p-6">
            <TaskList tasks={tasks} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 