# Coffee App Integration Guide

This guide explains how to run the integrated Coffee App with both the Spring Boot backend and React frontend.

## Architecture

- **Frontend**: React app running on port 8080 (Vite dev server)
- **Backend**: Spring Boot app running on port 8081 (Java/Maven)
- **Database**: MySQL (configured for localhost:3306)

## Prerequisites

1. **Java 17+** - Required for Spring Boot backend
2. **Maven** - For building the Java backend (wrapper included)
3. **Node.js 18+** - For the React frontend
4. **MySQL** - Database server running on localhost:3306

## Database Setup

1. Install and start MySQL server
2. Create a database named `coffee_app` (or let Spring Boot create it automatically)
3. Update database credentials in `backend/src/main/resources/application.properties` if needed:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=password
   ```

## Quick Start

### Option 1: Run both servers with one command

```bash
npm run dev:full
```

### Option 2: Run servers separately

**Terminal 1 - Backend:**

```bash
cd backend
./mvnw spring-boot:run
```

**Terminal 2 - Frontend:**

```bash
npm run dev:frontend
```

## Access Points

- **Frontend App**: http://localhost:8080
- **Backend API**: http://localhost:8081/api
- **API Documentation**: Available at backend endpoints

## Sample Users

The backend initializes with sample users:

- **Admin**: username `admin`, password `admin123`
- **User**: username `user`, password `user123`

## API Endpoints

### Authentication

- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signout` - User logout

### Machines

- `GET /api/machines` - Get all machines
- `GET /api/machines/{id}` - Get machine by ID
- `GET /api/machines/machine/{machineId}` - Get machine by machine ID
- `PUT /api/machines/{id}` - Update machine
- `PUT /api/machines/{id}/supplies` - Update machine supplies
- `GET /api/machines/locations` - Get all locations
- `GET /api/machines/offices?location={location}` - Get offices by location
- `GET /api/machines/floors?location={location}&office={office}` - Get floors
- `GET /api/machines/by-location-office-floor` - Get machines by location/office/floor
- `GET /api/machines/low-supplies?threshold={number}` - Get machines with low supplies
- `GET /api/machines/maintenance-needed` - Get machines needing maintenance

## Development Notes

1. **Hot Reload**: Both frontend and backend support hot reload during development
2. **CORS**: Configured to allow frontend (localhost:8080) to call backend (localhost:8081)
3. **JWT Authentication**: Backend uses JWT tokens for authentication
4. **Data Persistence**: Backend uses MySQL for persistent data storage
5. **Sample Data**: Backend automatically creates sample machines and users on first run

## Troubleshooting

### Backend Issues

- Ensure Java 17+ is installed: `java -version`
- Check MySQL is running: Try connecting to localhost:3306
- Check backend logs for detailed error messages

### Frontend Issues

- Ensure Node.js is installed: `node -version`
- Clear browser cache and localStorage
- Check browser console for API call errors

### Database Connection Issues

- Verify MySQL server is running
- Check database credentials in `application.properties`
- Ensure database `coffee_app` exists (or let Spring Boot create it)

## Production Deployment

For production deployment:

1. Build the frontend: `npm run build:client`
2. Build the backend: `cd backend && ./mvnw clean package`
3. Configure production database settings
4. Deploy both applications to your preferred hosting platform
