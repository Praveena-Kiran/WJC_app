# Base Node image
FROM node:20-alpine AS base
WORKDIR /app

# Copy root manifests
COPY package*.json ./
COPY mobile/package*.json ./mobile/

# Install dependencies
RUN npm install --prefix mobile

# Copy source files
COPY . .

# Expose server port
EXPOSE 3000

# Start production app
CMD ["npm", "start", "--prefix", "mobile"]
