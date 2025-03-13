# Use Node.js for running the Vite app
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the project
RUN npm run build

# Expose the port Vite uses
EXPOSE 4173

# Start the Vite preview server
CMD ["npm", "run", "preview", "--", "--host"]