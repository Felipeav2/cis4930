# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
# We are currently in the root of the repo, and the app is in the /app folder
COPY app/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY app/ .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
