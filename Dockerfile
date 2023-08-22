# Use Node 16 Alpine image as base
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json before other files
COPY package*.json ./

# Install dependencies 
RUN npm install

# Copy all files
COPY . .

# Expose port 
EXPOSE 8000