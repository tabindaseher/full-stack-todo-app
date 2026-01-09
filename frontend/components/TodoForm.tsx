import { useState } from 'react';
import { Todo } from '@/types/todo';
import { api } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface TodoFormProps {
  onAdd: (newTodo: Todo) => void;
  onCancel?: () => void;
}

const TodoForm = ({ onAdd, onCancel }: TodoFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    try {
      const newTodo = await api.createTodo({
        title: title.trim(),
        description: description.trim(),
        completed: false,
        priority,
        dueDate: dueDate || undefined,
      });

      onAdd(newTodo.todo);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    } catch (err) {
      console.error('Error creating todo:', err);
      setError('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md border border-gray-200">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Create New Task</h3>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 text-red-700 p-3.5 rounded-lg flex items-center shadow-sm">
            <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              disabled={loading}
              className="w-full p-3.5 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 bg-gray-50 shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details (optional)"
              className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none bg-gray-50 shadow-sm"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none bg-gray-50 shadow-sm"
                disabled={loading}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none bg-gray-50 shadow-sm"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <Button
              type="submit"
              isLoading={loading}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-md"
            >
              Add New Task
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default TodoForm;