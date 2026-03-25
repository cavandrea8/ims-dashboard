#!/bin/bash

echo "=== IMS Dashboard Startup Script ==="

# Start MongoDB if not running
if ! pgrep -x mongod > /dev/null; then
    echo "Starting MongoDB..."
    mongod --dbpath /data/db --bind_ip localhost --logpath /data/db/mongodb.log --fork
    sleep 2
fi

# Check MongoDB status
if pgrep -x mongod > /dev/null; then
    echo "✓ MongoDB is running"
else
    echo "✗ MongoDB failed to start"
    exit 1
fi

# Start backend
echo "Starting backend server..."
cd /workspaces/work/ims-dashboard/backend
node server.js &
BACKEND_PID=$!
sleep 3

# Check backend status
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo "✓ Backend is running (PID: $BACKEND_PID)"
else
    echo "✗ Backend failed to start"
    exit 1
fi

# Start frontend
echo "Starting frontend dev server..."
cd /workspaces/work/ims-dashboard
npm run dev &
FRONTEND_PID=$!
sleep 3

# Check frontend status
if kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "✓ Frontend is running (PID: $FRONTEND_PID)"
else
    echo "✗ Frontend failed to start"
    exit 1
fi

echo ""
echo "=== All services started ==="
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo "MongoDB:  mongodb://localhost:27017"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for all processes
wait
