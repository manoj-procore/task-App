import { useState, useEffect, useCallback, useMemo } from 'react';
import APIService from '../services/apiService';
import type { Task, Comment } from '../services/apiService';

// Hook for fetching all tasks
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await APIService.getAllTasks();
      
      if (response.success) {
        setTasks(response.data);
      } else {
        setError(response.message || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError('An error occurred while fetching tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Return tasks, loading state, error state, and refetch function
  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks
  };
};

// Hook for task search functionality
export const useTaskSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Task[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchTasks = useCallback(async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      setSearchError(null);
      const response = await APIService.searchTasks(term);
      
      if (response.success) {
        setSearchResults(response.data);
      } else {
        setSearchError(response.message || 'Search failed');
      }
    } catch (err) {
      setSearchError('An error occurred during search');
    } finally {
      setSearching(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchTasks(searchTerm);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchTasks]);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    searching,
    searchError,
    searchTasks
  };
};

// Hook for task CRUD operations
export const useTaskOperations = () => {
  const [operationLoading, setOperationLoading] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);

  const createTask = useCallback(async (taskData: Omit<Task, 'id'>) => {
    try {
      setOperationLoading(true);
      setOperationError(null);
      const response = await APIService.createTask(taskData);   
      if (response.success) {
        return response.data;
      } else {
        setOperationError(response.message || 'Failed to create task');
        return null;
      }
    } catch (err) {
      setOperationError('An error occurred while creating task');
      return null;
    } finally {
      setOperationLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (id: number, taskData: Task) => {
    try {
      setOperationLoading(true);
      setOperationError(null);
      console.log('🔄 Hook: Updating task with ID:', id);
      console.log('📝 Hook: Task data:', taskData);
      const response = await APIService.updateTask(id, taskData);
      
      if (response.success) {
        console.log('✅ Hook: Task updated successfully:', response.data);
        return response.data;
      } else {
        console.error('❌ Hook: Update failed:', response.message);
        setOperationError(response.message || 'Failed to update task');
        return null;
      }
    } catch (err) {
      console.error('❌ Hook: Update error:', err);
      setOperationError('An error occurred while updating task');
      return null;
    } finally {
      setOperationLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: number) => {
    try {
      setOperationLoading(true);
      setOperationError(null);
      const response = await APIService.deleteTask(id);
      
      if (response.success) {
        return true;
      } else {
        setOperationError(response.message || 'Failed to delete task');
        return false;
      }
    } catch (err) {
      setOperationError('An error occurred while deleting task');
      return false;
    } finally {
      setOperationLoading(false);
    }
  }, []);

  const getTask = useCallback(async (id: number) => {
    try {
      setOperationLoading(true);
      setOperationError(null);
      const response = await APIService.getTask(id);
      
      if (response.success) {
        return response.data;
      } else {
        setOperationError(response.message || 'Failed to get task');
        return null;
      }
    } catch (err) {
      setOperationError('An error occurred while fetching task');
      return null;
    } finally {
      setOperationLoading(false);
    }
  }, []);

  return {
    createTask,
    updateTask,
    deleteTask,
    getTask,
    operationLoading,
    operationError,
    clearError: () => setOperationError(null)
  };
};

// Hook for task statistics (used in Dashboard)
export const useTaskStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    initiated: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await APIService.getAllTasks();
      
      if (response.success) {
        const tasks = response.data;
        const newStats = {
          total: tasks.length,
          inProgress: tasks.filter((task: Task) => task.status === 'In Progress').length,
          completed: tasks.filter((task: Task) => task.status === 'Completed').length,
          initiated: tasks.filter((task: Task) => task.status === 'Initiated').length
        };
        setStats(newStats);
      } else {
        setError(response.message || 'Failed to fetch statistics');
      }
    } catch (err) {
      setError('An error occurred while fetching statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

// Hook for combining tasks and search functionality
export const useTasksWithSearch = () => {
  const { tasks: allTasks, loading: tasksLoading, error: tasksError, refetch } = useTasks();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
    assignee: ''
  });

  // Filter tasks based on search term and filters (client-side filtering)
  const displayTasks = useMemo(() => {
    let filteredTasks = allTasks;

    // Apply filters first
    if (filters.status) {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }
    if (filters.category) {
      filteredTasks = filteredTasks.filter(task => task.category === filters.category);
    }
    if (filters.priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
    }
    if (filters.assignee) {
      filteredTasks = filteredTasks.filter(task => 
        task.assignee && task.assignee.toLowerCase().includes(filters.assignee.toLowerCase())
      );
    }

    // Then apply search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredTasks = filteredTasks.filter((task: Task) =>
        (task.title && task.title.toLowerCase().includes(searchLower)) ||
        (task.description && task.description.toLowerCase().includes(searchLower)) ||
        (task.assignee && task.assignee.toLowerCase().includes(searchLower)) ||
        (task.category && task.category.toLowerCase().includes(searchLower)) ||
        (task.status && task.status.toLowerCase().includes(searchLower)) ||
        (task.priority && task.priority.toLowerCase().includes(searchLower))
      );
    }

    return filteredTasks;
  }, [allTasks, searchTerm, filters]);

  // Get unique values for filter options
  const filterOptions = useMemo(() => ({
    statuses: [...new Set(allTasks.map(task => task.status).filter(Boolean))],
    categories: [...new Set(allTasks.map(task => task.category).filter(Boolean))],
    priorities: [...new Set(allTasks.map(task => task.priority).filter(Boolean))],
    assignees: [...new Set(allTasks.map(task => task.assignee).filter(Boolean))]
  }), [allTasks]);

  const clearFilters = () => {
    setFilters({
      status: '',
      category: '',
      priority: '',
      assignee: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

  return {
    tasks: displayTasks,
    allTasks,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    filterOptions,
    clearFilters,
    hasActiveFilters,
    loading: tasksLoading,
    error: tasksError,
    refetch,
    totalTasks: allTasks.length,
    filteredTasks: displayTasks.length
  };
};

// Hook for fetching comments for a specific task
export const useTaskComments = (taskId: number) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!taskId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await APIService.getTaskComments(taskId);
      
      if (response.success) {
        setComments(response.data);
      } else {
        setError(response.message || 'Failed to fetch comments');
      }
    } catch (err) {
      setError('An error occurred while fetching comments');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    loading,
    error,
    refetch: fetchComments
  };
};

// Hook for comment operations (create, delete, etc.)
export const useCommentOperations = () => {
  const [operationLoading, setOperationLoading] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);

  const addComment = useCallback(async (
    taskId: number, 
    commentData: Omit<Comment, 'id' | 'taskItemId' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      setOperationLoading(true);
      setOperationError(null);
      const response = await APIService.addComment(taskId, commentData);
      
      if (response.success) {
        return true;
      } else {
        setOperationError(response.message || 'Failed to add comment');
        return false;
      }
    } catch (err) {
      setOperationError('An error occurred while adding comment');
      return false;
    } finally {
      setOperationLoading(false);
    }
  }, []);

  // Note: Comment deletion is not supported by the backend

  return {
    addComment,
    operationLoading,
    operationError,
    clearError: () => setOperationError(null)
  };
};

// Hook for managing comments for a specific task (combines fetching and operations)
export const useTaskCommentsWithOperations = (taskId: number) => {
  const { comments, loading, error, refetch } = useTaskComments(taskId);
  const { 
    addComment, 
    operationLoading, 
    operationError, 
    clearError 
  } = useCommentOperations();

  const handleAddComment = useCallback(async (
    commentData: Omit<Comment, 'id' | 'taskItemId' | 'createdAt' | 'updatedAt'>
  ) => {
    const success = await addComment(taskId, commentData);
    if (success) {
      // Refresh comments after adding
      refetch();
    }
    return success;
  }, [addComment, taskId, refetch]);

  // Note: Comment deletion is not supported by the backend

  return {
    comments,
    loading,
    error,
    addComment: handleAddComment,
    operationLoading,
    operationError,
    clearError,
    refetch
  };
}; 