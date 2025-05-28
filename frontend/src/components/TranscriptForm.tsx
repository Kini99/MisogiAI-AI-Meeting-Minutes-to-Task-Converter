import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '@/services/api';
import toast from 'react-hot-toast';

export default function TranscriptForm() {
  const [transcript, setTranscript] = useState('');
  const queryClient = useQueryClient();

  const { mutate: parseTranscript, isLoading } = useMutation({
    mutationFn: taskApi.parseTranscript,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setTranscript('');
      toast.success('Tasks extracted successfully!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to parse transcript');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) {
      toast.error('Please enter a meeting transcript');
      return;
    }
    parseTranscript(transcript);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="transcript"
          className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
        >
          Meeting Transcript
        </label>
        <div className="mt-1">
          <textarea
            id="transcript"
            name="transcript"
            rows={4}
            className="p-3 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-secondary-700 dark:border-secondary-600 dark:text-white sm:text-sm"
            placeholder="Paste your meeting transcript here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
        </div>
        <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">
          Example: "Aman you take the landing page by 10pm tomorrow. Rajeev you take care of client follow-up by Wednesday."
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Extract Tasks'}
        </button>
      </div>
    </form>
  );
} 