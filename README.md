# Task Management Application

A full-stack task management application built with React (Frontend) and Spring Boot (Backend), using PostgreSQL as the database.

## 🏗️ Architecture

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Spring Boot 3.5.3 + Java 17
- **Database**: PostgreSQL 16
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

### For Docker Setup (Recommended)
- [Docker](https://docs.docker.com/get-docker/) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0+)

### For Local Development Setup
- [Node.js](https://nodejs.org/) (version 18+)
- [Java JDK](https://adoptium.net/) (version 17+)
- [Maven](https://maven.apache.org/install.html) (version 3.6+)
- [PostgreSQL](https://www.postgresql.org/download/) (version 12+)

## 🚀 Quick Start with Docker (Recommended)

### 1. Clone the Repository
```bash
git clone https://github.com/ansh-procore/full-stack-app.git
cd task-App
```

### 2. Build and Run with Docker Compose
```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up --build -d
```

### 3. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **API Documentation (Swagger)**: http://localhost:8080/swagger-ui.html
- **Database**: localhost:5432 (if needed for direct access)

### 4. Stop the Application
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clears database data)
docker-compose down -v
```

## 🛠️ Local Development Setup

### Database Setup
1. Install and start PostgreSQL
2. Create a database:
```sql
CREATE DATABASE taskDB;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE taskDB TO postgres;
```

### Setup for Jar File Creation
```bash
# Navigate to backend directory
cd TaskTool

# Build the project
mvn clean package -DskipTests


**Backend will be available at**: http://localhost:8080

### Frontend Setup
```bash
# Navigate to frontend directory
cd task-ui

# Install dependencies
npm install

# Start development server
npm run dev

# Alternative commands
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

**Frontend will be available at**: http://localhost:5173

## 📝 Environment Variables

### Backend Environment Variables
When running locally, you can set these environment variables or modify `application.properties`:

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/taskDB
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=postgres
```

### Docker Environment Variables
These are automatically configured in `docker-compose.yml`:
- `SPRING_DATASOURCE_URL`: jdbc:postgresql://database:5432/taskDB
- `SPRING_DATASOURCE_USERNAME`: postgres
- `SPRING_DATASOURCE_PASSWORD`: postgres

## 🗄️ Database

The application uses PostgreSQL with the following configuration:
- **Database Name**: taskDB
- **Username**: postgres
- **Password**: postgres
- **Port**: 5432

### Database Initialization
The application automatically:
- Creates database schema from `schema.sql`
- Populates initial data from `data.sql`
- Updates schema using Hibernate DDL auto-update

## 📚 API Documentation

The backend provides Swagger/OpenAPI documentation:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs JSON**: http://localhost:8080/v3/api-docs


## 📁 Project Structure

```
task-App/
├── docker-compose.yml          # Docker orchestration
├── task-ui/                    # React Frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   └── hooks/             # Custom React hooks
│   ├── package.json
│   └── Dockerfile
├── TaskTool/                   # Spring Boot Backend
│   ├── src/main/java/         # Java source code
│   │   └── com/example/TaskTool/
│   │       ├── controller/    # REST controllers
│   │       ├── model/         # Entity models
│   │       ├── repository/    # Data repositories
│   │       └── service/       # Business logic
│   ├── src/main/resources/    # Application resources
│   ├── pom.xml               # Maven dependencies
│   └── Dockerfile
└── README.md
```

## 🔧 Common Commands

### Docker Commands
```bash
# View running containers
docker ps

# View logs
docker-compose logs -f

# Rebuild a specific service
docker-compose build backend
docker-compose build frontend

# Remove all containers and volumes
docker-compose down -v

# Access container shell
docker exec -it task-backend bash
docker exec -it task-frontend sh
```

### Development Commands
```bash
# Backend - Generate JAR file
cd TaskTool && ./mvnw clean package

# Frontend - Build for production
cd task-ui && npm run build

# Check application health
curl http://localhost:8080/actuator/health  # Backend health
curl http://localhost:5173                  # Frontend
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   lsof -i :8080  # Backend
   lsof -i :5173  # Frontend
   lsof -i :5432  # Database
   ```

2. **Database connection issues**
   - Ensure PostgreSQL is running
   - Check connection string and credentials
   - For Docker: ensure containers can communicate

3. **Docker build issues**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

4. **Frontend not loading**
   - Check if Node.js version is 18+
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 