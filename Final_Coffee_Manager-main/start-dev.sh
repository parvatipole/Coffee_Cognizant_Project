#!/bin/bash

echo "Starting Coffee App Development Environment..."

# Function to cleanup background processes
cleanup() {
    echo "Stopping servers..."
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    exit
}

# Set trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Start the Spring Boot backend
echo "Starting Spring Boot backend on port 8081..."
cd backend
./mvnw spring-boot:run &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 5

# Start the frontend dev server
echo "Starting Frontend dev server on port 8080..."
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
echo "Both servers are starting..."
echo "Frontend: http://localhost:8080"
echo "Backend API: http://localhost:8081/api"
echo "Press Ctrl+C to stop both servers"

wait
