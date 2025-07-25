import React, { useState } from 'react';
import { useTaskOperations } from '../hooks/useTasks';
import type { Task } from '../services/apiService';

interface CreateTaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated?: (task: Task) => void;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ isOpen, onClose, onTaskCreated }) => {
  const [taskData, setTaskData] = useState({
    number: '', // Task number as string
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    status: 'Initiated' as Task['status'],
    category: 'General' as Task['category'],
    priority: 'Medium' as Task['priority']
  });

  const [comments, setComments] = useState<Array<{ userName: string; comment: string; timestamp: Date }>>([]);
  const [newComment, setNewComment] = useState({ userName: '', comment: '' });

  const { createTask, operationLoading, operationError, clearError } = useTaskOperations();

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

  const addComment = () => {
    if (!newComment.userName.trim() || !newComment.comment.trim()) {
      alert('Please fill in both username and comment fields');
      return;
    }

    setComments(prev => [...prev, {
      ...newComment,
      timestamp: new Date()
    }]);
    setNewComment({ userName: '', comment: '' });
  };

  const removeComment = (index: number) => {
    setComments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskData.number.trim() || !taskData.title.trim() || !taskData.description.trim() || !taskData.assignee.trim()) {
      alert('⚠️ Please fill in all required fields:\n• Task Number\n• Title\n• Description\n• Assignee');
      return;
    }

    console.log('📝 Starting task creation process...');

    // Convert date to ISO timestamp format for backend
    const taskDataToSend = {
      number: taskData.number.trim(), // Include task number as string
      title: taskData.title.trim(),
      description: taskData.description.trim(),
      assignee: taskData.assignee.trim(),
      dueDate: taskData.dueDate ? new Date(taskData.dueDate + 'T00:00:00Z').toISOString() : '',
      status: taskData.status,
      category: taskData.category,
      priority: taskData.priority
    };

    console.log('🚀 Creating new task with data:', taskDataToSend);

    const result = await createTask(taskDataToSend);
    console.log('🚀 Result:', result);
    if (result) {
      // Show success alert with task details
      alert(`✅ Task created successfully!`);
      
      // Notify parent component to refresh task list
      onTaskCreated?.(result);
      
      // Close the modal
      handleClose();
    } else {
      // Show error alert if creation failed
      alert('❌ Failed to create task. Please try again.');
    }
  };

  const handleClose = () => {
    setTaskData({
      number: '', // Reset task number field
      title: '',
      description: '',
      assignee: '',
      dueDate: '',
      status: 'Initiated' as Task['status'],
      category: 'General',
      priority: 'Medium'
    });
    setComments([]);
    setNewComment({ userName: '', comment: '' });
    clearError();
    onClose();
  };

  if (!isOpen) return null;

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
        {/* Left Side - Task Creation Form */}
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
            <h2 style={{ margin: 0, color: '#333' }}>Create New Task</h2>
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
                min="1"
                placeholder="Enter task number"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2196f3'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
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
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2196f3'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
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
                  transition: 'border-color 0.2s',
                  outline: 'none',
                  resize: 'vertical'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2196f3'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
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
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2196f3'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
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
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2196f3'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={operationLoading}
              style={{
                padding: '14px 28px',
                backgroundColor: operationLoading ? '#ccc' : '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: operationLoading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                marginTop: '10px'
              }}
            >
              {operationLoading ? 'Creating Task...' : 'Create Task'}
            </button>
          </form>
        </div>

        {/* Right Side - Comments Section */}
        <div style={{
          flex: '0 0 400px',
          padding: '24px',
          backgroundColor: '#f8f9fa',
          overflow: 'auto'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
            💬 Comments & Notes ({comments.length})
          </h3>

          {/* Comments List */}
          <div style={{ marginBottom: '20px', maxHeight: '300px', overflow: 'auto' }}>
            {comments.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '30px 20px',
                color: '#666',
                fontStyle: 'italic',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '2px dashed #ddd'
              }}>
                No comments yet. Add some notes or thoughts about this task!
              </div>
            ) : (
              comments.map((comment, index) => (
                <div
                  key={index}
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
                    <strong style={{ color: '#2196f3', fontSize: '14px' }}>
                      {comment.userName}
                    </strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {comment.timestamp.toLocaleTimeString()}
                      </span>
                      <button
                        onClick={() => removeComment(index)}
                        style={{
                          backgroundColor: '#ffebee',
                          color: '#d32f2f',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                        title="Remove comment"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
                    {comment.comment}
                  </p>
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
                placeholder="Your name"
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
                placeholder="Your comment or note..."
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
              onClick={addComment}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
                             onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#1976d2'}
               onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#2196f3'}
            >
              Add Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskForm; 