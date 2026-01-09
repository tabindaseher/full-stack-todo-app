'use client';

import { useState, useEffect } from 'react';
import { Todo } from '@/types/todo';
import { TodoFilters } from '@/types/filters';
import TodoList from '@/components/TodoList';
import { api } from '@/lib/api';
import Button from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for the metrics cards
const metricsData = [
  { title: 'Total Tasks', value: '1,234', change: '+12%', icon: '📋', color: 'blue' },
  { title: 'Completed', value: '892', change: '+8%', icon: '✅', color: 'green' },
  { title: 'Pending', value: '342', change: '-5%', icon: '⏳', color: 'yellow' },
  { title: 'High Priority', value: '128', change: '+15%', icon: '🔥', color: 'red' },
];

// Mock data for the table
const tableData = [
  { id: 1, name: 'Marketing Campaign', assignee: 'John Doe', deadline: '2024-01-15', status: 'Completed', progress: 100 },
  { id: 2, name: 'Website Redesign', assignee: 'Jane Smith', deadline: '2024-01-20', status: 'In Progress', progress: 65 },
  { id: 3, name: 'Product Launch', assignee: 'Bob Johnson', deadline: '2024-01-25', status: 'Pending', progress: 0 },
  { id: 4, name: 'Client Onboarding', assignee: 'Alice Brown', deadline: '2024-01-18', status: 'In Progress', progress: 40 },
  { id: 5, name: 'Team Training', assignee: 'Charlie Wilson', deadline: '2024-01-22', status: 'Pending', progress: 0 },
];

const ReportsPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<TodoFilters>({
    statusFilter: 'all',
    priorityFilter: 'all',
    searchQuery: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const { user } = useAuth();

  // Load todos on component mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const response = await api.getTodos();
      setTodos(response.todos);
      setError('');
    } catch (err) {
      console.error('Error loading todos:', err);
      setError('Failed to load todos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof TodoFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Calculate statistics
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;
  const highPriorityTodos = todos.filter(todo => todo.priority === 'high' && !todo.completed).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">Detailed insights and analytics for your projects and tasks.</p>
      </motion.div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{metric.value}</p>
                <p className={`text-xs mt-1 ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change} from last month
                </p>
              </div>
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                metric.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                metric.color === 'green' ? 'bg-green-100 text-green-600' :
                metric.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                'bg-red-100 text-red-600'
              }`}>
                <span className="text-lg">{metric.icon}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Project Progress Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Project Progress</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignee
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData.map((row, index) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 * index }}
                  className={`hover:bg-gray-50 transition-colors duration-150 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {row.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {row.assignee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {row.deadline}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {row.status === 'Completed' ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    ) : row.status === 'In Progress' ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        In Progress
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            row.progress === 100 ? 'bg-green-600' :
                            row.progress >= 50 ? 'bg-blue-600' :
                            'bg-yellow-600'
                          }`}
                          style={{ width: `${row.progress}%` }}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm text-gray-600">{row.progress}%</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Todo Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="space-y-6"
      >
        {/* Todo Controls */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <select
                value={filters.statusFilter}
                onChange={(e) => handleFilterChange('statusFilter', e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={filters.priorityFilter}
                onChange={(e) => handleFilterChange('priorityFilter', e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition bg-white"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition bg-white"
              >
                <option value="createdAt">Sort by Date</option>
                <option value="dueDate">Sort by Due Date</option>
                <option value="priority">Sort by Priority</option>
              </select>

              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition bg-white"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-3">
              <input
                type="text"
                placeholder="Search tasks..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition bg-white flex-grow min-w-[200px]"
              />

              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-lg shadow-sm"
              >
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Todo List */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {filters.statusFilter === 'all'
                ? 'All Tasks'
                : filters.statusFilter === 'active'
                  ? 'Active Tasks'
                  : 'Completed Tasks'}
              <span className="text-gray-500 text-sm font-normal ml-2">({todos.length})</span>
            </h2>
          </div>

          <TodoList
            todos={todos}
            onUpdate={() => {}} // Reports page doesn't need update functionality
            onDelete={() => {}} // Reports page doesn't need delete functionality
            filters={filters}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ReportsPage;