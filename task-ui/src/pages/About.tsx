import './About.css';

const About = () => {
  return (
    <div className="about">
      <div className="about-content">
        <h1>About Task Manager</h1>
        <p>
          This is a modern task management application built with React and React Router.
          It allows you to manage your tasks efficiently with features like:
        </p>
        
        <ul className="feature-list">
          <li>Create, edit, and delete tasks</li>
          <li>Search and filter functionality</li>
          <li>Status tracking</li>
          <li>Assignee management</li>
          <li>Due date tracking</li>
          <li>Category organization</li>
        </ul>
        
        <div className="tech-stack">
          <h2>Built with:</h2>
          <div className="tech-items">
            <span className="tech-item">React</span>
            <span className="tech-item">React Router</span>
            <span className="tech-item">CSS3</span>
            <span className="tech-item">JavaScript ES6+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 