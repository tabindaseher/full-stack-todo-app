import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateTodoItemData } from '../../models/todo-item';
import Input from '../ui/input';
import Button from '../ui/button';

interface AddTodoFormProps {
  onCreateTodo: (todoData: CreateTodoItemData) => Promise<void>;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onCreateTodo }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateTodoItemData>({
    defaultValues: {
      title: '',
      description: '',
      dueDate: undefined,
      priority: 'medium'
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: CreateTodoItemData) => {
    setIsLoading(true);
    setError(null);

    try {
      await onCreateTodo(data);
      reset(); // Clear the form
      setIsOpen(false); // Close the form after successful submission
    } catch (err) {
      console.error('Error creating todo:', err);
      setError('Failed to create todo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      {isOpen ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <Input
            label="Todo Title"
            type="text"
            placeholder="What do you need to do?"
            {...register('title', {
              required: 'Title is required',
              minLength: {
                value: 1,
                message: 'Title must be at least 1 character'
              },
              maxLength: {
                value: 200,
                message: 'Title must be less than 200 characters'
              }
            })}
            error={errors.title?.message}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Priority
              </label>
              <select
                {...register('priority', { required: 'Priority is required' })}
                defaultValue="medium"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.priority && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.priority.message}
                </p>
              )}
            </div>

            <Input
              label="Due Date (optional)"
              type="date"
              {...register('dueDate')}
            />
          </div>

          <Input
            label="Description (optional)"
            type="text"
            placeholder="Add details..."
            {...register('description')}
          />

          <div className="flex space-x-2 pt-2">
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
            >
              Add Todo
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsOpen(false);
                reset({
                  title: '',
                  description: '',
                  dueDate: undefined,
                  priority: 'medium'
                }); // Reset to default values
                setError(null);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button
          type="button"
          variant="outline"
          fullWidth
          onClick={() => {
            setIsOpen(true);
            setError(null); // Clear any previous errors when opening the form
          }}
        >
          + Add New Todo
        </Button>
      )}
    </div>
  );
};

export default AddTodoForm;