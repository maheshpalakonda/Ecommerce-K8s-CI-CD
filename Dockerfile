# Stage 1: Build stage
FROM node:18 AS builder
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Stage 2: Production image
FROM node:18-slim
WORKDIR /app

# Copy built app
COPY --from=builder /app ./

# Expose the port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]

