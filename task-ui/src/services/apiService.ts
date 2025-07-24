import axios, { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';

// Define interfaces for type safety
export interface Task {
  id: number;
  number: string; // Task number as string
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: 'Initiated' | 'In Progress' | 'Completed' | 'Security';
  category: 'General' | 'Development' | 'Design' | 'Testing' | 'Documentation' | 'Bug Fix';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface Comment {
  id?: number;
  taskItemId: number;
  createdAt?: string;
  updatedAt?: string;
  userName: string;
  comment: string;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  total: number;
  message?: string;
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/rest/v1/task_items';

// Create Axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (for adding auth tokens, logging, etc.)
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (for handling common errors)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error:', error.message);
    
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      console.error('Unauthorized access');
    } else if (error.response?.status === 500) {
      console.error('Server error');
    }
    
    return Promise.reject(error);
  }
);

// Helper function to transform responses
const transformResponse = <T>(response: AxiosResponse<T>): APIResponse<T> => {
  return {
    success: true,
    data: response.data,
    total: Array.isArray(response.data) ? response.data.length : (response.data ? 1 : 0),
    message: 'Success'
  };
};

// Helper function to handle errors
const handleError = <T>(error: AxiosError): APIResponse<T> => {
  const errorData = error.response?.data as any;
  return {
    success: false,
    data: null as T,
    total: 0,
    message: errorData?.message || error.message || 'An error occurred'
  };
};

// API Service Class
class APIService {
  // GET /rest/v1/task_items - Get all tasks
  static async getAllTasks(): Promise<APIResponse<Task[]>> {
    try {
      const response = await apiClient.get<Task[]>('');
      return transformResponse(response);
    } catch (error) {
      return handleError<Task[]>(error as AxiosError);
    }
  }

  // Search tasks by term (client-side filtering)
  static async searchTasks(searchTerm: string): Promise<APIResponse<Task[]>> {
    try {
      const response = await this.getAllTasks();
      if (response.success && response.data) {
        const filteredTasks = response.data.filter((task: Task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        return {
          success: true,
          data: filteredTasks,
          total: filteredTasks.length,
          message: 'Search completed'
        };
      }
      return response;
    } catch (error) {
      return handleError<Task[]>(error as AxiosError);
    }
  }

  // DELETE /rest/v1/task_items/task/{id} - Delete task
  static async deleteTask(id: number): Promise<APIResponse<null>> {
    try {
      console.log(`Attempting to delete task with ID: ${id}`);
      const response = await apiClient.delete(`/task/${id}`);
      console.log('Delete response:', response);
      return {
        success: true,
        data: null,
        total: 0,
        message: 'Task deleted successfully'
      };
    } catch (error) {
      console.error('Delete task error:', error);
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as AxiosError;
        console.error('Response status:', axiosError.response?.status);
        console.error('Response data:', axiosError.response?.data);
        console.error('Response headers:', axiosError.response?.headers);
      }
      return handleError<null>(error as AxiosError);
    }
  }

  // GET /rest/v1/task_items/task/{id} - Get single task
  static async getTask(id: number): Promise<APIResponse<Task | null>> {
    try {
      const response = await apiClient.get<Task>(`/task/${id}`);
      return transformResponse(response);
    } catch (error) {
      return handleError<Task | null>(error as AxiosError);
    }
  }

  // PUT /rest/v1/task_items/task/{id} - Update task
  static async updateTask(id: number, updatedTask: Task): Promise<APIResponse<Task | null>> {
    try {
      console.log(`🔄 API: Updating task ${id} with data:`, updatedTask);
      const response = await apiClient.put<Task>(`/task/${id}`, updatedTask);
      console.log('✅ API: Task update response:', response.data);
      return transformResponse(response);
    } catch (error) {
      console.error('❌ API: Task update failed:', error);
      if (error instanceof AxiosError) {
        console.error('❌ API: Request data that failed:', updatedTask);
        console.error('❌ API: Error response:', error.response?.data);
        console.error('❌ API: Error status:', error.response?.status);
      }
      return handleError<Task | null>(error as AxiosError);
    }
  }

  // POST /rest/v1/task_items - Create new task
  static async createTask(task: Omit<Task, 'id'>): Promise<APIResponse<Task>> {
    try {
      console.log('🆕 API: Creating new task with data:', task);
      const response = await apiClient.post<Task>('', task);
      console.log('✅ API: Task created successfully:', response.data);
      return {
        success: true,
        data: response.data,
        total: 1,
        message: 'Task created successfully'
      };
    } catch (error) {
      console.error('❌ API: Task creation failed:', error);
      if (error instanceof AxiosError) {
        console.error('❌ API: Request data that failed:', task);
        console.error('❌ API: Error response:', error.response?.data);
        console.error('❌ API: Error status:', error.response?.status);
      }
      return handleError<Task>(error as AxiosError);
    }
  }

  // POST /rest/v1/task_items/{taskId}/comment - Add comment to task
  static async addComment(taskId: number, comment: Omit<Comment, 'id' | 'taskItemId' | 'createdAt' | 'updatedAt'>): Promise<APIResponse<null>> {
    try {
      const commentData = {
        ...comment,
        taskItemId: taskId
      };
      await apiClient.post(`/${taskId}/comment`, commentData);
      return {
        success: true,
        data: null,
        total: 0,
        message: 'Comment added successfully'
      };
    } catch (error) {
      return handleError<null>(error as AxiosError);
    }
  }

  // GET /rest/v1/task_items/{taskId}/comment - Get all comments for a task
  static async getTaskComments(taskId: number): Promise<APIResponse<Comment[]>> {
    try {
      const response = await apiClient.get<Comment[]>(`/${taskId}/comment`);
      return transformResponse(response);
    } catch (error) {
      return handleError<Comment[]>(error as AxiosError);
    }
  }

  // Note: Comment deletion is not supported by the backend
  // Only GET and POST operations are available for comments

  // Utility methods for compatibility

  // Get tasks with pagination (client-side)
  static async getTasksPaginated(page: number = 0, size: number = 10): Promise<APIResponse<Task[]>> {
    try {
      const response = await this.getAllTasks();
      if (response.success && response.data) {
        const startIndex = page * size;
        const endIndex = startIndex + size;
        const paginatedTasks = response.data.slice(startIndex, endIndex);
        
        return {
          success: true,
          data: paginatedTasks,
          total: response.data.length,
          message: 'Paginated results'
        };
      }
      return response;
    } catch (error) {
      return handleError<Task[]>(error as AxiosError);
    }
  }

  // Get tasks by status (client-side filtering)
  static async getTasksByStatus(status: string): Promise<APIResponse<Task[]>> {
    try {
      const response = await this.getAllTasks();
      if (response.success && response.data) {
        const filteredTasks = response.data.filter((task: Task) => 
          task.status.toLowerCase() === status.toLowerCase()
        );
        
        return {
          success: true,
          data: filteredTasks,
          total: filteredTasks.length,
          message: 'Filtered by status'
        };
      }
      return response;
    } catch (error) {
      return handleError<Task[]>(error as AxiosError);
    }
  }

  // Get tasks by assignee (client-side filtering)
  static async getTasksByAssignee(assignee: string): Promise<APIResponse<Task[]>> {
    try {
      const response = await this.getAllTasks();
      if (response.success && response.data) {
        const filteredTasks = response.data.filter((task: Task) => 
          task.assignee.toLowerCase().includes(assignee.toLowerCase())
        );
        
        return {
          success: true,
          data: filteredTasks,
          total: filteredTasks.length,
          message: 'Filtered by assignee'
        };
      }
      return response;
    } catch (error) {
      return handleError<Task[]>(error as AxiosError);
    }
  }
}

export default APIService; 