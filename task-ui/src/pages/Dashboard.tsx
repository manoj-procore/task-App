import { Link } from 'react-router-dom';
import { useTaskStats } from '../hooks/useTasks';
import './Dashboard.css';

const Dashboard = () => {
  const { stats, loading, error, refetch } = useTaskStats();

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome to the Task Management System</p>
        </div>
        
        <div className="dashboard-stats">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card">
              <h3>Loading...</h3>
              <p className="stat-number">...</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome to the Task Management System</p>
        </div>
        
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
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to the Task Management System</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <p className="stat-number">{stats.inProgress}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-number">{stats.completed}</p>
        </div>
        <div className="stat-card">
          <h3>Initiated</h3>
          <p className="stat-number">{stats.initiated}</p>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <Link to="/tasks" className="action-button">
          View All Tasks
        </Link>
        <button 
          onClick={refetch} 
          className="action-button secondary"
          style={{ 
            backgroundColor: '#f8f9fa', 
            color: '#333', 
            border: '1px solid #ddd',
            marginLeft: '12px'
          }}
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default Dashboard; 