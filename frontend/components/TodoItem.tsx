import { Todo } from '@/types/todo';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { api } from '@/lib/api';
import Button from '@/components/ui/Button';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (updatedTodo: Todo) => void;
  onDelete: (id: string) => void;
}

const TodoItem = ({ todo, onUpdate, onDelete }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>(todo.priority);
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      const updatedTodo = await api.updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed
      });
      onUpdate(updatedTodo.todo);
    } catch (error) {
      console.error('Error updating todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const updatedTodo = await api.updateTodo(todo.id, {
        title: editText,
        description: editDescription,
        priority: editPriority
      });
      onUpdate(updatedTodo.todo);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.deleteTodo(todo.id);
      onDelete(todo.id);
    } catch (error) {
      console.error('Error deleting todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Priority color mapping
  const priorityColors = {
    low: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    high: 'bg-red-100 text-red-700 border-red-200',
  };

  // Priority icon mapping
  const priorityIcons = {
    low: '🟢',
    medium: '🟡',
    high: '🔴',
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`p-5 rounded-xl border transition-all duration-200 ${
        todo.completed
          ? 'bg-gray-50 border-gray-200 opacity-80'
          : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
      }`}
    >
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none bg-gray-50 shadow-sm"
            placeholder="Task title..."
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none bg-gray-50 shadow-sm"
            placeholder="Description (optional)"
            rows={2}
          />
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 outline-none bg-gray-50 shadow-sm"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <div className="flex gap-2 ml-auto">
              <Button
                onClick={handleSaveEdit}
                isLoading={loading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl"
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={loading}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggleComplete}
            disabled={loading}
            className="h-5 w-5 mt-0.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={`text-sm mt-1 ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                    {todo.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityColors[todo.priority]}`}>
                  {priorityIcons[todo.priority]} {todo.priority}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    disabled={loading}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                  >
                    ✏️
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={loading}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              {todo.dueDate && (
                <div className="flex items-center gap-1">
                  <span>📅</span>
                  <span>Due: {formatDate(todo.dueDate)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span>📅</span>
                <span>Created: {formatDate(todo.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.li>
  );
};

export default TodoItem;