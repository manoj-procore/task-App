import React from 'react';
import { useTaskCommentsWithOperations } from '../hooks/useTasks';
import type { Task } from '../services/apiService';

interface ViewTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (task: Task) => void;
}

const ViewTaskModal: React.FC<ViewTaskModalProps> = ({ task, isOpen, onClose, onEdit }) => {
  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    refetch: refetchComments
  } = useTaskCommentsWithOperations(task?.id || 0);

  if (!isOpen || !task) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Initiated': return '#2196f3';
      case 'In Progress': return '#ff9800';
      case 'Completed': return '#4caf50';
      case 'Pending': return '#f44336';
      default: return '#666';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

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
        maxWidth: '1000px',
        height: '80vh',
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Left Side - Task Details */}
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
            <h2 style={{ margin: 0, color: '#333' }}>Task Details</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              {onEdit && (
                <button
                  onClick={() => onEdit(task)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ✏️ Edit
                </button>
              )}
              <button
                onClick={onClose}
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
          </div>

          {/* Task Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* ID */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: '600',
                color: '#666',
                fontSize: '12px',
                textTransform: 'uppercase'
              }}>
                Task ID
              </label>
              <div style={{
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                border: '1px solid #e0e0e0',
                fontSize: '16px',
                fontWeight: '600',
                color: '#333'
              }}>
                #{task.id}
              </div>
            </div>

            {/* Title */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: '600',
                color: '#666',
                fontSize: '12px',
                textTransform: 'uppercase'
              }}>
                Title
              </label>
              <div style={{
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                border: '1px solid #e0e0e0',
                fontSize: '16px',
                color: '#333'
              }}>
                {task.title}
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: '600',
                color: '#666',
                fontSize: '12px',
                textTransform: 'uppercase'
              }}>
                Description
              </label>
              <div style={{
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                border: '1px solid #e0e0e0',
                fontSize: '14px',
                color: '#333',
                lineHeight: '1.5',
                minHeight: '80px'
              }}>
                {task.description}
              </div>
            </div>

                         {/* Grid for remaining fields */}
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
               {/* Assignee */}
               <div>
                 <label style={{ 
                   display: 'block', 
                   marginBottom: '6px', 
                   fontWeight: '600',
                   color: '#666',
                   fontSize: '12px',
                   textTransform: 'uppercase'
                 }}>
                   Assignee
                 </label>
                 <div style={{
                   padding: '12px',
                   backgroundColor: '#f8f9fa',
                   borderRadius: '6px',
                   border: '1px solid #e0e0e0',
                   fontSize: '14px',
                   color: '#333'
                 }}>
                   👤 {task.assignee}
                 </div>
               </div>

               {/* Due Date */}
               <div>
                 <label style={{ 
                   display: 'block', 
                   marginBottom: '6px', 
                   fontWeight: '600',
                   color: '#666',
                   fontSize: '12px',
                   textTransform: 'uppercase'
                 }}>
                   Due Date
                 </label>
                 <div style={{
                   padding: '12px',
                   backgroundColor: '#f8f9fa',
                   borderRadius: '6px',
                   border: '1px solid #e0e0e0',
                   fontSize: '14px',
                   color: '#333'
                 }}>
                   📅 {formatDate(task.dueDate)}
                 </div>
               </div>

               {/* Status */}
               <div>
                 <label style={{ 
                   display: 'block', 
                   marginBottom: '6px', 
                   fontWeight: '600',
                   color: '#666',
                   fontSize: '12px',
                   textTransform: 'uppercase'
                 }}>
                   Status
                 </label>
                 <div style={{
                   padding: '12px',
                   backgroundColor: getStatusColor(task.status),
                   color: 'white',
                   borderRadius: '6px',
                   fontSize: '14px',
                   fontWeight: '600',
                   textAlign: 'center'
                 }}>
                   {task.status}
                 </div>
               </div>

               {/* Category */}
               <div>
                 <label style={{ 
                   display: 'block', 
                   marginBottom: '6px', 
                   fontWeight: '600',
                   color: '#666',
                   fontSize: '12px',
                   textTransform: 'uppercase'
                 }}>
                   Category
                 </label>
                 <div style={{
                   padding: '12px',
                   backgroundColor: '#f8f9fa',
                   borderRadius: '6px',
                   border: '1px solid #e0e0e0',
                   fontSize: '14px',
                   color: '#333'
                 }}>
                   🏷️ {task.category}
                 </div>
               </div>

               {/* Priority */}
               <div>
                 <label style={{ 
                   display: 'block', 
                   marginBottom: '6px', 
                   fontWeight: '600',
                   color: '#666',
                   fontSize: '12px',
                   textTransform: 'uppercase'
                 }}>
                   Priority
                 </label>
                 <div style={{
                   padding: '12px',
                   backgroundColor: '#f8f9fa',
                   borderRadius: '6px',
                   border: '1px solid #e0e0e0',
                   fontSize: '14px',
                   color: '#333'
                 }}>
                   ⚡ {task.priority}
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Right Side - Comments */}
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
          {commentsError && (
            <div style={{
              backgroundColor: '#ffebee',
              border: '1px solid #f44336',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '16px',
              color: '#d32f2f',
              fontSize: '14px'
            }}>
              Error loading comments: {commentsError}
            </div>
          )}

          {/* Comments List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {commentsLoading ? (
              <div style={{
                textAlign: 'center',
                padding: '30px 20px',
                color: '#666',
                fontStyle: 'italic'
              }}>
                Loading comments...
              </div>
            ) : comments.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '30px 20px',
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
                    padding: '14px',
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
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {comment.createdAt && formatDateTime(comment.createdAt)}
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
        </div>
      </div>
    </div>
  );
};

export default ViewTaskModal; 