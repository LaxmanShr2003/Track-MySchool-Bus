# Use Node.js 20.15.0 as base image
FROM node:20.15.0

# Set the working directory in the container
WORKDIR /app

# Copy package files first to install dependencies efficiently
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application
COPY . .

# Expose the port (adjust if needed)
EXPOSE 3000

# Command to run the app
CMD ["npm", "run", "dev"]
