export interface TodoFilters {
  statusFilter: 'all' | 'active' | 'completed';
  priorityFilter: 'all' | 'low' | 'medium' | 'high';
  searchQuery: string;
  sortBy: 'createdAt' | 'dueDate' | 'priority';
  sortOrder: 'asc' | 'desc';
}