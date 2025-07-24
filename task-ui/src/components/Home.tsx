
import  { useState } from 'react';
import CreateTaskForm from './CreateTaskForm';
import { useTaskStats } from '../hooks/useTasks';

function Home() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { stats, loading, error } = useTaskStats();

  const handleTaskCreated = () => {
    // Optional: Add any additional logic when task is created
    console.log('Task created successfully from Home page!');
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '50px',
        padding: '60px 40px',
        backgroundColor: '#f8f9fa',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '3rem',
          margin: '0 0 20px 0',
          color: '#333',
          fontWeight: '700'
        }}>
          Welcome to Task Manager
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#666',
          margin: '0 0 40px 0',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: '1.6'
        }}>
          Organize your work, collaborate with your team, and get things done efficiently. 
          Create tasks, track progress, and manage everything in one place.
        </p>
        
        {/* Create Task Button */}
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            padding: '16px 32px',
            fontSize: '18px',
            fontWeight: '600',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px'
          }}
          onMouseOver={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.backgroundColor = '#45a049';
            target.style.transform = 'translateY(-2px)';
            target.style.boxShadow = '0 6px 16px rgba(76, 175, 80, 0.4)';
          }}
          onMouseOut={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.backgroundColor = '#4caf50';
            target.style.transform = 'translateY(0)';
            target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
          }}
        >
          <span style={{ fontSize: '24px' }}>✨</span>
          Create New Task
        </button>
      </div>

      {/* Task Statistics Section */}
      <div style={{
        marginBottom: '50px',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0'
      }}>
        <h2 style={{
          textAlign: 'center',
          margin: '0 0 30px 0',
          color: '#333',
          fontSize: '2rem',
          fontWeight: '600'
        }}>
          📊 Task Overview
        </h2>
        
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid #e0e0e0'
              }}>
                <div style={{ color: '#666', fontSize: '18px', marginBottom: '10px' }}>Loading...</div>
                <div style={{ color: '#999', fontSize: '24px', fontWeight: 'bold' }}>...</div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#ff6b6b',
            fontSize: '16px'
          }}>
            <p>Error loading task statistics: {error}</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {/* Total Tasks */}
            <div style={{
              padding: '25px',
              backgroundColor: '#e3f2fd',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px solid #2196f3',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ 
                fontSize: '36px', 
                marginBottom: '10px' 
              }}>📋</div>
              <div style={{ 
                color: '#1976d2', 
                fontSize: '18px', 
                fontWeight: '600',
                marginBottom: '8px' 
              }}>Total Tasks</div>
              <div style={{ 
                color: '#1976d2', 
                fontSize: '32px', 
                fontWeight: 'bold' 
              }}>{stats.total}</div>
            </div>

            {/* In Progress */}
            <div style={{
              padding: '25px',
              backgroundColor: '#fff3e0',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px solid #ff9800',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ 
                fontSize: '36px', 
                marginBottom: '10px' 
              }}>🔄</div>
              <div style={{ 
                color: '#f57c00', 
                fontSize: '18px', 
                fontWeight: '600',
                marginBottom: '8px' 
              }}>In Progress</div>
              <div style={{ 
                color: '#f57c00', 
                fontSize: '32px', 
                fontWeight: 'bold' 
              }}>{stats.inProgress}</div>
            </div>

            {/* Completed */}
            <div style={{
              padding: '25px',
              backgroundColor: '#e8f5e8',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px solid #4caf50',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ 
                fontSize: '36px', 
                marginBottom: '10px' 
              }}>✅</div>
              <div style={{ 
                color: '#388e3c', 
                fontSize: '18px', 
                fontWeight: '600',
                marginBottom: '8px' 
              }}>Completed</div>
              <div style={{ 
                color: '#388e3c', 
                fontSize: '32px', 
                fontWeight: 'bold' 
              }}>{stats.completed}</div>
            </div>

            {/* Initiated */}
            <div style={{
              padding: '25px',
              backgroundColor: '#f3e5f5',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px solid #9c27b0',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ 
                fontSize: '36px', 
                marginBottom: '10px' 
              }}>🚀</div>
              <div style={{ 
                color: '#7b1fa2', 
                fontSize: '18px', 
                fontWeight: '600',
                marginBottom: '8px' 
              }}>Initiated</div>
              <div style={{ 
                color: '#7b1fa2', 
                fontSize: '32px', 
                fontWeight: 'bold' 
              }}>{stats.initiated}</div>
            </div>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        marginBottom: '50px'
      }}>
        <div style={{
          padding: '30px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>Task Management</h3>
          <p style={{ margin: 0, color: '#666', lineHeight: '1.5' }}>
            Create, edit, and organize tasks with ease. Set due dates, assign team members, 
            and track progress all in one place.
          </p>
        </div>

        <div style={{
          padding: '30px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
          <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>Comments & Notes</h3>
          <p style={{ margin: 0, color: '#666', lineHeight: '1.5' }}>
            Add comments and notes to tasks for better collaboration. Keep track of 
            important discussions and updates.
          </p>
        </div>

        <div style={{
          padding: '30px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>Search & Filter</h3>
          <p style={{ margin: 0, color: '#666', lineHeight: '1.5' }}>
            Quickly find tasks with powerful search and filtering capabilities. 
            Filter by status, assignee, category, and more.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        textAlign: 'center',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0'
      }}>
        <h2 style={{ margin: '0 0 24px 0', color: '#333' }}>Quick Actions</h2>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#1976d2'}
            onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#2196f3'}
          >
            📝 Create Task
          </button>
          
          <button
            onClick={() => window.location.href = '/tasks'}
            style={{
              padding: '12px 24px',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#f57c00'}
            onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#ff9800'}
          >
            📊 View All Tasks
          </button>
          
          <button
            onClick={() => alert('Dashboard coming soon!')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#9c27b0',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#7b1fa2'}
            onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#9c27b0'}
          >
            📈 Dashboard
          </button>
        </div>
      </div>

      {/* Create Task Form Modal */}
      <CreateTaskForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}

export default Home;