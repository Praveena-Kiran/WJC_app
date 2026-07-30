FROM node:20-alpine AS base
WORKDIR /app

# Copy mobile package manifests
COPY mobile/package*.json ./mobile/

# Install dependencies inside mobile
WORKDIR /app/mobile
RUN npm install

# Copy mobile application code
COPY mobile/ ./

# Expose server port
EXPOSE 3000

# Start production server
CMD ["npm", "start"]
