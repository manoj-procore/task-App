import React, { useState, useEffect } from 'react';
import { useTaskOperations, useTaskCommentsWithOperations } from '../hooks/useTasks';
import type { Task } from '../services/apiService';

interface EditTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated?: (task: Task) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, isOpen, onClose, onTaskUpdated }) => {
  const [taskData, setTaskData] = useState({
    number: '',
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    status: 'Initiated' as Task['status'],
    category: 'General' as Task['category'],
    priority: 'Medium' as Task['priority']
  });

  const [newComment, setNewComment] = useState({ userName: '', comment: '' });

  const { updateTask, operationLoading, operationError, clearError } = useTaskOperations();
  
  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    addComment,
    operationLoading: commentOperationLoading,
    operationError: commentOperationError,
    clearError: clearCommentError,
    refetch: refetchComments
  } = useTaskCommentsWithOperations(task?.id || 0);

  // Initialize form data when task changes
  useEffect(() => {
    if (task) {
      // Convert ISO timestamp back to date string for the date input
      const formatDateForInput = (isoString: string) => {
        if (!isoString) return '';
        try {
          return new Date(isoString).toISOString().split('T')[0];
        } catch {
          return '';
        }
      };

      setTaskData({
        number: task.number || '',
        title: task.title || '',
        description: task.description || '',
        assignee: task.assignee || '',
        dueDate: formatDateForInput(task.dueDate),
        status: task.status || 'Initiated',
        category: task.category || 'General',
        priority: task.priority || 'Medium'
      });
    }
  }, [task]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewComment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddComment = async () => {
    if (!newComment.userName.trim() || !newComment.comment.trim()) {
      alert('Please fill in both username and comment fields');
      return;
    }

    const success = await addComment(newComment);
    if (success) {
      setNewComment({ userName: '', comment: '' });
    }
  };

  // Note: Comment deletion is not supported by the backend

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task) return;
    
    if (!taskData.number.trim() || !taskData.title.trim() || !taskData.description.trim() || !taskData.assignee.trim()) {
      alert('Please fill in all required fields (Task Number, Title, Description, Assignee)');
      return;
    }

    // Convert date to ISO timestamp format for backend and include task ID
    const taskDataToSend = {
      id: task.id, // Include the task ID
      number: taskData.number.trim(), // Include the task number
      title: taskData.title.trim(),
      description: taskData.description.trim(),
      assignee: taskData.assignee.trim(),
      dueDate: taskData.dueDate ? new Date(taskData.dueDate + 'T00:00:00Z').toISOString() : '',
      status: taskData.status,
      category: taskData.category,
      priority: taskData.priority
    };

    console.log('🚀 Sending UPDATE request for task:', task.id);
    console.log('📤 Complete task data being sent:', taskDataToSend);

    const result = await updateTask(task.id, taskDataToSend);
    if (result) {
      alert('Task updated successfully!');
      onTaskUpdated?.(result);
      handleClose();
    }
  };

  const handleClose = () => {
    setNewComment({ userName: '', comment: '' });
    clearError();
    clearCommentError();
    onClose();
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90vw',
        maxWidth: '1200px',
        height: '80vh',
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Left Side - Edit Task Form */}
        <div style={{
          flex: '1',
          padding: '24px',
          borderRight: '1px solid #e0e0e0',
          overflow: 'auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{ margin: 0, color: '#333' }}>Edit Task #{task.id}</h2>
            <button
              onClick={handleClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>
          </div>

          {/* Error Display */}
          {operationError && (
            <div style={{
              backgroundColor: '#ffebee',
              border: '1px solid #f44336',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '20px',
              color: '#d32f2f'
            }}>
              {operationError}
              <button
                onClick={clearError}
                style={{
                  float: 'right',
                  background: 'none',
                  border: 'none',
                  color: '#d32f2f',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Task Number */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: '600',
                color: '#333'
              }}>
                Task Number *
              </label>
              <input
                type="text"
                name="number"
                value={taskData.number}
                onChange={handleInputChange}
                required
                placeholder="Enter task number"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Title */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: '600',
                color: '#333'
              }}>
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={taskData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter task title"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: '600',
                color: '#333'
              }}>
                Description *
              </label>
              <textarea
                name="description"
                value={taskData.description}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Enter task description"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Assignee */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: '600',
                color: '#333'
              }}>
                Assignee *
              </label>
              <input
                type="text"
                name="assignee"
                value={taskData.assignee}
                onChange={handleInputChange}
                required
                placeholder="Enter assignee name"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Due Date */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: '600',
                color: '#333'
              }}>
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Status, Category & Priority in three columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              {/* Status */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Status
                </label>
                <select
                  name="status"
                  value={taskData.status}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                >
                  <option value="Initiated">Initiated</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Category
                </label>
                <select
                  name="category"
                  value={taskData.category}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                >
                  <option value="General">General</option>
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Testing">Testing</option>
                  <option value="Documentation">Documentation</option>
                  <option value="Bug Fix">Bug Fix</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Priority
                </label>
                <select
                  name="priority"
                  value={taskData.priority}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    outline: 'none'
                  }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Submit Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  flex: '1',
                  padding: '14px 28px',
                  backgroundColor: '#f8f9fa',
                  color: '#333',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={operationLoading}
                style={{
                  flex: '2',
                  padding: '14px 28px',
                  backgroundColor: operationLoading ? '#ccc' : '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: operationLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {operationLoading ? 'Updating Task...' : 'Update Task'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side - Comments Section */}
        <div style={{
          flex: '0 0 400px',
          padding: '24px',
          backgroundColor: '#f8f9fa',
          overflow: 'auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: 0, color: '#333' }}>
              💬 Comments ({comments.length})
            </h3>
            <button
              onClick={refetchComments}
              style={{
                padding: '6px 12px',
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🔄 Refresh
            </button>
          </div>

          {/* Comments Error */}
          {(commentsError || commentOperationError) && (
            <div style={{
              backgroundColor: '#ffebee',
              border: '1px solid #f44336',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '16px',
              color: '#d32f2f'
            }}>
              {commentsError || commentOperationError}
              <button
                onClick={clearCommentError}
                style={{
                  float: 'right',
                  background: 'none',
                  border: 'none',
                  color: '#d32f2f',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
          )}

          {/* Comments List */}
          <div style={{ marginBottom: '20px', maxHeight: '300px', overflow: 'auto' }}>
            {commentsLoading ? (
              <div style={{
                textAlign: 'center',
                padding: '20px',
                color: '#666',
                fontStyle: 'italic'
              }}>
                Loading comments...
              </div>
            ) : comments.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '20px',
                color: '#666',
                fontStyle: 'italic',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '2px dashed #ddd'
              }}>
                No comments yet for this task.
              </div>
            ) : (
              comments.map((comment, index) => (
                <div
                  key={comment.id || index}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <strong style={{ 
                      color: '#2196f3', 
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      👤 {comment.userName}
                    </strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {comment.createdAt && formatDateTime(comment.createdAt)}
                      </span>
                      {/* Delete functionality not available in backend */}
                    </div>
                  </div>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '14px', 
                    lineHeight: '1.4',
                    color: '#333'
                  }}>
                    {comment.comment}
                  </p>
                  {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                    <div style={{
                      fontSize: '11px',
                      color: '#999',
                      marginTop: '6px',
                      fontStyle: 'italic'
                    }}>
                      Updated: {formatDateTime(comment.updatedAt)}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Add Comment Form */}
          <div style={{
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h4 style={{ margin: '0 0 16px 0', color: '#333' }}>Add Comment</h4>
            
            <div style={{ marginBottom: '12px' }}>
              <input
                type="text"
                name="userName"
                value={newComment.userName}
                onChange={handleCommentChange}
                placeholder="Your username"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <textarea
                name="comment"
                value={newComment.comment}
                onChange={handleCommentChange}
                placeholder="Your comment..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical',
                  outline: 'none'
                }}
              />
            </div>

            <button
              onClick={handleAddComment}
              disabled={commentOperationLoading}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: commentOperationLoading ? '#ccc' : '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: commentOperationLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {commentOperationLoading ? 'Adding...' : 'Add Comment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal; 