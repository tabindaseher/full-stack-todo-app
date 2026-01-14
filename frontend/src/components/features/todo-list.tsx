import React, { useState } from 'react';
import { TodoItem, CreateTodoItemData } from '../../models/todo-item';
import TodoItemComponent from './todo-item';
import AddTodoForm from './add-todo-form';
import { updateTodo, deleteTodo, toggleTodoCompletion } from '../../services/todo-service';

interface TodoListProps {
  todos?: TodoItem[];
  onCreateTodo: (todoData: CreateTodoItemData) => Promise<void>;
  onRefresh: () => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onCreateTodo, onRefresh }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  // Filter todos based on selected filter
  const filteredTodos = todos?.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  }) || [];

  // Sort todos based on selected sort option
  const sortedTodos = filteredTodos && filteredTodos.length > 0 ?
    [...filteredTodos].sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      // Default sort by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }) : [];

  const handleToggleCompletion = async (id: string, completed: boolean) => {
    setLoadingStates(prev => ({ ...prev, [id]: true }));
    setError(null);

    try {
      await toggleTodoCompletion(id, completed);
      onRefresh(); // Refresh the list after successful update
    } catch (err) {
      console.error('Error toggling todo completion:', err);
      setError('Failed to update todo status. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDeleteTodo = async (id: string) => {
    setLoadingStates(prev => ({ ...prev, [id]: true }));
    setError(null);

    try {
      await deleteTodo(id);
      onRefresh(); // Refresh the list after successful deletion
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleUpdateTodo = async (id: string, data: Partial<TodoItem>) => {
    setLoadingStates(prev => ({ ...prev, [id]: true }));
    setError(null);

    try {
      await updateTodo(id, data);
      onRefresh(); // Refresh the list after successful update
    } catch (err) {
      console.error('Error updating todo:', err);
      setError('Failed to update todo. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">All Todos</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'priority')}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>
      </div>

      {/* Add Todo Form */}
      <AddTodoForm onCreateTodo={onCreateTodo} />

      {/* Todo List */}
      <div className="space-y-4">
        {sortedTodos.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No todos</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new todo.</p>
          </div>
        ) : (
          sortedTodos.map(todo => (
            <TodoItemComponent
              key={todo.id}
              todo={todo}
              onToggleCompletion={handleToggleCompletion}
              onDelete={handleDeleteTodo}
              onUpdate={handleUpdateTodo}
              isLoading={loadingStates[todo.id]}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;