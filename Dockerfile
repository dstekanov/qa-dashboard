# Build stage for Frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend

# Install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy source and build
COPY frontend/ ./
RUN npm run build

# Build stage for Backend
FROM node:20-slim AS backend-build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy backend source
COPY backend/ ./backend/

# Final stage
FROM node:20-slim
WORKDIR /app

# Copy built assets and dependencies
COPY --from=backend-build /app/node_modules ./node_modules
COPY --from=backend-build /app/backend ./backend
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
COPY package*.json ./

# Configure backend to serve frontend
RUN echo "app.use('/', express.static('frontend/dist'));" >> backend/server.js

EXPOSE 3000
CMD ["npm", "start"] 