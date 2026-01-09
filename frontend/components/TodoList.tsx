import { Todo } from '@/types/todo';
import TodoItem from '@/components/TodoItem';
import { motion, AnimatePresence } from 'framer-motion';
import { TodoFilters } from '@/types/filters';

interface TodoListProps {
  todos: Todo[];
  onUpdate: (updatedTodo: Todo) => void;
  onDelete: (id: string) => void;
  filters: TodoFilters;
}

const TodoList = ({ todos, onUpdate, onDelete, filters }: TodoListProps) => {
  // Apply filters
  const filteredTodos = todos.filter(todo => {
    // Apply status filter
    if (filters.statusFilter === 'active' && todo.completed) return false;
    if (filters.statusFilter === 'completed' && !todo.completed) return false;

    // Apply priority filter
    if (filters.priorityFilter !== 'all' && todo.priority !== filters.priorityFilter) return false;

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = todo.title.toLowerCase().includes(query);
      const matchesDescription = todo.description?.toLowerCase().includes(query) || false;
      if (!matchesTitle && !matchesDescription) return false;
    }

    return true;
  });

  // Apply sorting
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    let comparison = 0;

    switch (filters.sortBy) {
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
        break;
    }

    return filters.sortOrder === 'asc' ? comparison : -comparison;
  });

  if (sortedTodos.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No todos found</h3>
        <p className="text-gray-500 mt-1">
          {filters.searchQuery || filters.statusFilter !== 'all' || filters.priorityFilter !== 'all'
            ? 'Try changing your filters'
            : 'Get started by creating a new todo'}
        </p>
      </div>
    );
  }

  return (
    <motion.ul
      className="space-y-3"
      layout
      initial={false}
    >
      <AnimatePresence>
        {sortedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </motion.ul>
  );
};

export default TodoList;