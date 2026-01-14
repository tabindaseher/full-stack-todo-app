import React, { useState } from 'react';
import { TodoItem } from '../../models/todo-item';
import Button from '../ui/button';
import Card from '../ui/card';

interface TodoItemProps {
  todo: TodoItem;
  onToggleCompletion: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<TodoItem>) => void;
  isLoading: boolean;
}

const TodoItemComponent: React.FC<TodoItemProps> = ({
  todo,
  onToggleCompletion,
  onDelete,
  onUpdate,
  isLoading
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState(todo.priority || 'medium');

  const handleToggleCompletion = () => {
    onToggleCompletion(todo.id, !todo.completed);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      onDelete(todo.id);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(todo.id, {
      title: editTitle,
      description: editDescription || undefined,
      priority: editPriority,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority || 'medium');
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <Card className={`transition-all duration-200 ${todo.completed ? 'opacity-70 bg-gray-50' : 'bg-white'}`}>
      {isEditing ? (
        // Edit mode
        <div className="space-y-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Todo title"
          />

          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Todo description (optional)"
            rows={3}
          />

          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <div className="flex space-x-2">
            <Button onClick={handleSave} variant="primary" size="sm">
              Save
            </Button>
            <Button onClick={handleCancel} variant="secondary" size="sm">
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        // View mode
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start space-x-3 flex-1">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={handleToggleCompletion}
              disabled={isLoading}
              className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {todo.title}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[(todo.priority as keyof typeof priorityColors)] || priorityColors.medium}`}>
                  {(todo.priority || 'medium').charAt(0).toUpperCase() + (todo.priority || 'medium').slice(1)}
                </span>
              </div>

              {todo.description && (
                <p className={`mt-1 text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-500'}`}>
                  {todo.description}
                </p>
              )}

              <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                <span>Created: {formatDate(todo.createdAt)}</span>
                <span>Updated: {formatDate(todo.updatedAt)}</span>
                {todo.dueDate && (
                  <span className="text-red-500">Due: {formatDate(todo.dueDate)}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-shrink-0 space-x-2">
            <Button
              onClick={handleEdit}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              variant="danger"
              size="sm"
              disabled={isLoading}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TodoItemComponent;