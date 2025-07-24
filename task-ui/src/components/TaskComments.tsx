import React, { useState } from 'react';
import { useTaskCommentsWithOperations } from '../hooks/useTasks';

interface TaskCommentsProps {
  taskId: number;
  isOpen: boolean;
  onClose: () => void;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ taskId, isOpen, onClose }) => {
  const [newComment, setNewComment] = useState({
    comment: '',
    userName: ''
  });

  const {
    comments,
    loading,
    error,
    addComment,
    operationLoading,
    operationError,
    clearError,
    refetch
  } = useTaskCommentsWithOperations(taskId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.comment.trim() || !newComment.userName.trim()) {
      alert('Please fill in both username and comment fields');
      return;
    }

    const success = await addComment(newComment);
    if (success) {
      setNewComment({ comment: '', userName: '' });
      alert('Comment added successfully!');
    }
  };

  // Note: Comment deletion is not supported by the backend

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewComment(prev => ({
      ...prev,
      [name]: value
    }));
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
        padding: '24px',
        borderRadius: '8px',
        width: '600px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0 }}>Comments for Task #{taskId}</h2>
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

        {/* Error Display */}
        {(error || operationError) && (
          <div style={{
            backgroundColor: '#ffebee',
            border: '1px solid #f44336',
            borderRadius: '4px',
            padding: '12px',
            marginBottom: '16px',
            color: '#d32f2f'
          }}>
            {error || operationError}
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

        {/* Comments List */}
        <div style={{ marginBottom: '24px' }}>
          <h3>Comments ({comments.length})</h3>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '20px', 
              color: '#666',
              fontStyle: 'italic'
            }}>
              No comments yet. Be the first to add one!
            </div>
          ) : (
            <div>
              {comments.map((comment, index) => (
                <div
                  key={comment.id || index}
                  style={{
                    border: '1px solid #eee',
                    borderRadius: '4px',
                    padding: '12px',
                    marginBottom: '8px',
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong>{comment.userName}</strong>
                      {comment.createdAt && (
                        <span style={{ color: '#666', fontSize: '12px' }}>
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    {/* Delete functionality not available in backend */}
                  </div>
                  <p style={{ margin: 0 }}>{comment.comment}</p>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={refetch}
            style={{
              padding: '6px 12px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              marginTop: '8px'
            }}
          >
            🔄 Refresh Comments
          </button>
        </div>

        {/* Add Comment Form */}
        <div>
          <h3>Add New Comment</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                fontWeight: '500' 
              }}>
                Username *
              </label>
              <input
                type="text"
                name="userName"
                value={newComment.userName}
                onChange={handleInputChange}
                required
                placeholder="Your username"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px', 
                fontWeight: '500' 
              }}>
                Comment *
              </label>
              <textarea
                name="comment"
                value={newComment.comment}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Enter your comment here..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'flex-end' 
            }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f8f9fa',
                  color: '#333',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={operationLoading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: operationLoading ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: operationLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {operationLoading ? 'Adding...' : 'Add Comment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskComments; 