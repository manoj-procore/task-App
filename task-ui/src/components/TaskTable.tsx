
import  { useState, useEffect, useRef } from 'react';
import { useTasksWithSearch, useTaskOperations } from '../hooks/useTasks';
import TaskComments from './TaskComments';
import ViewTaskModal from './ViewTaskModal';
import EditTaskModal from './EditTaskModal';
import CreateTaskForm from './CreateTaskForm';
import type { Task } from '../services/apiService';
import './TaskTable.css';

const TaskTable = () => {
  const [commentsTaskId, setCommentsTaskId] = useState<number | null>(null);
  const [viewTask, setViewTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);

  // Close filters dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);

  const {
    tasks,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    filterOptions,
    clearFilters,
    hasActiveFilters,
    loading,
    error,
    refetch,
    totalTasks,
    filteredTasks
  } = useTasksWithSearch();

  const {
    deleteTask,
    operationLoading,
    operationError,
    clearError
  } = useTaskOperations();

  const handleEdit = (task: Task) => {
    console.log('Edit task clicked:', task.id);
    setEditTask(task);
  };

  const handleView = (task: Task) => {
    console.log('View task clicked:', task.id);
    setViewTask(task);
  };

  const handleComments = (id: number) => {
    console.log('Comments clicked for task:', id);
    setCommentsTaskId(id);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    console.log('Task updated:', updatedTask);
    // Refresh the task list to show updated data
    refetch();
  };

  const handleCreateTask = () => {
    console.log('Create new task clicked');
    setShowCreateForm(true);
  };

  const handleTaskCreated = (createdTask: Task) => {
    console.log('✅ Task created successfully:', createdTask);
    
    // Close the create form modal first
    setShowCreateForm(false);
    
    // Refresh the task list to show new task
    console.log('🔄 Refreshing task list to show new task...');
    refetch();
    
    // Additional success feedback in console
    console.log(`🎉 Task "${createdTask.title}" (${createdTask.number}) has been added to the list!`);
  };

  const handleDelete = async (id: number) => {
    console.log('Delete task clicked:', id);
    
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;

    console.log('Attempting to delete task:', id);
    const success = await deleteTask(id);
    
    if (success) {
      console.log('Task deleted successfully:', id);
      // Refresh the task list after deletion
      refetch();
    } else {
      console.error('Failed to delete task:', id);
      console.error('Delete error:', operationError);
    }
  };

  if (loading) {
    return (
      <div className="task-table-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-table-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={refetch} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-table-container">
      {/* Show operation error if any */}
      {operationError && (
        <div className="error-banner">
          <p className="error-message">{operationError}</p>
          <button onClick={clearError} className="close-error">×</button>
        </div>
      )}

      <div className="table-header">
        <div className="header-left">
          <button 
            className="create-task-button"
            onClick={handleCreateTask}
          >
            ➕ Create New Task
          </button>
        </div>
        <div className="header-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by title, description, assignee, category, status, or priority..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search-button"
                onClick={() => setSearchTerm('')}
                title="Clear search"
              >
                ❌
              </button>
            )}
            <button className="search-button">🔍</button>
          </div>
          <div className="filters-container" ref={filtersRef}>
            <button 
              className={`filters-button ${hasActiveFilters ? 'has-active-filters' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              🔽 Filters {hasActiveFilters && <span className="filter-count">({Object.values(filters).filter(f => f).length})</span>}
            </button>
            
            {showFilters && (
              <div className="filters-dropdown">
                <div className="filters-header">
                  <h4>Filter Tasks</h4>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="clear-all-filters">
                      Clear All
                    </button>
                  )}
                </div>
                
                <div className="filter-group">
                  <label>Status</label>
                  <select 
                    value={filters.status} 
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                  >
                    <option value="">All Statuses</option>
                    {filterOptions.statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Category</label>
                  <select 
                    value={filters.category} 
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                  >
                    <option value="">All Categories</option>
                    {filterOptions.categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Priority</label>
                  <select 
                    value={filters.priority} 
                    onChange={(e) => setFilters({...filters, priority: e.target.value})}
                  >
                    <option value="">All Priorities</option>
                    {filterOptions.priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Assignee</label>
                  <select 
                    value={filters.assignee} 
                    onChange={(e) => setFilters({...filters, assignee: e.target.value})}
                  >
                    <option value="">All Assignees</option>
                    {filterOptions.assignees.map(assignee => (
                      <option key={assignee} value={assignee}>{assignee}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <table className="task-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>#</th>
            <th>Title <span className="sort-arrow">↕</span></th>
            <th>Description</th>
            <th>Assignee(s)</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Category</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td><input type="checkbox" /></td>
              <td>
                <div className="action-buttons">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(task)}
                    disabled={operationLoading}
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn view-btn"
                    onClick={() => handleView(task)}
                  >
                    View
                  </button>
                  <button
                    className="action-btn comments-btn"
                    onClick={() => handleComments(task.id)}
                  >
                    💬 Comments
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(task.id)}
                    disabled={operationLoading}
                  >
                    {operationLoading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
                <div className="task-number">{task.id}</div>
              </td>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.assignee}</td>
              <td>{task.dueDate}</td>
              <td>
                <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                  {task.status}
                </span>
              </td>
              <td>
                <span className="lock-icon">🔒</span>
                <span className="category-text">{task.category}</span>
              </td>
              <td>
                <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {tasks.length === 0 && !loading && (
        <div className="no-tasks">
          {searchTerm ? (
            <>
              <p>No tasks match your search for "{searchTerm}"</p>
              <p>Try adjusting your search term or <button 
                onClick={() => setSearchTerm('')} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#007bff', 
                  textDecoration: 'underline', 
                  cursor: 'pointer' 
                }}
              >
                clear the search
              </button></p>
            </>
          ) : (
            <p>No tasks found. <button 
              onClick={handleCreateTask}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#007bff', 
                textDecoration: 'underline', 
                cursor: 'pointer' 
              }}
            >
              Create your first task
            </button></p>
          )}
        </div>
      )}

      <div className="table-footer">
        <span>
          {(searchTerm || hasActiveFilters) ? (
            <>
              Showing {filteredTasks} of {totalTasks} tasks
              {searchTerm && (
                <span style={{ color: '#666', fontStyle: 'italic' }}>
                  {' '}(search: "{searchTerm}")
                </span>
              )}
              {hasActiveFilters && (
                <span style={{ color: '#666', fontStyle: 'italic' }}>
                  {' '}(filtered: {Object.values(filters).filter(f => f).length} filter{Object.values(filters).filter(f => f).length !== 1 ? 's' : ''})
                </span>
              )}
              {(filteredTasks !== totalTasks) && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    clearFilters();
                  }}
                  style={{ 
                    marginLeft: '10px',
                    background: 'none', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    padding: '2px 8px',
                    color: '#666', 
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Clear all
                </button>
              )}
            </>
          ) : (
            `${totalTasks} task${totalTasks !== 1 ? 's' : ''} total`
          )}
        </span>
        <div className="pagination">
          <span>Page:</span>
          <select defaultValue="1">
            <option value="1">1</option>
          </select>
          <button disabled>‹</button>
          <button disabled>›</button>
        </div>
      </div>

      {/* Comments Modal */}
      {commentsTaskId && (
        <TaskComments
          taskId={commentsTaskId}
          isOpen={commentsTaskId !== null}
          onClose={() => setCommentsTaskId(null)}
        />
      )}

      {/* View Task Modal */}
      <ViewTaskModal
        task={viewTask}
        isOpen={viewTask !== null}
        onClose={() => setViewTask(null)}
        onEdit={(task) => {
          setViewTask(null);
          setEditTask(task);
        }}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        task={editTask}
        isOpen={editTask !== null}
        onClose={() => setEditTask(null)}
        onTaskUpdated={handleTaskUpdated}
      />

      {/* Create Task Modal */}
      <CreateTaskForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
};

export default TaskTable;