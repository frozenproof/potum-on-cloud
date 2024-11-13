# Use an official Node.js runtime as a parent image
FROM --platform=linux/amd64 node:18

# Set the working directory in the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy only the necessary files and folders
COPY server/ ./server/
COPY templates/ ./templates/
COPY images/ ./images/
COPY database/ ./database/

# Set environment variable for the port
ENV PORT=4000
ENV PORT2=5000

# Expose ports 4000 for the proxy server and 5000 for the target server
EXPOSE 4000
EXPOSE 5000

# Start the proxy server (it will internally reach the server on port 5000)
CMD ["node", "server/proxyServer.js"]
