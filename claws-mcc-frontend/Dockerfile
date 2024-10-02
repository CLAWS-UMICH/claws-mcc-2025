# Use an official Node.js runtime as a parent image
FROM node:22

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install any needed packages
RUN npm install

# Copy the rest of the application to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 5173

# Build the app for production by default
CMD ["npm", "run", "dev"]


