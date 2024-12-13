# Use an official Node.js runtime as a parent image
FROM --platform=linux/amd64 node:18

# Set the working directory in the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy only the necessary files and folders
COPY server/server.js ./server/
COPY server/routes.js ./server/
COPY templates/ ./templates/
COPY images/ ./images/
COPY database/ ./database/

# Set environment variable for the port
ENV PORT=5000

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["node", "server/server.js"]
