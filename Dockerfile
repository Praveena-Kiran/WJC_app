FROM node:20-alpine AS base
WORKDIR /app

# Copy mobile package manifests and prisma schema
COPY mobile/package*.json ./mobile/
COPY mobile/prisma ./mobile/prisma

# Install dependencies and generate Prisma Client
WORKDIR /app/mobile
RUN npm install
RUN npx prisma generate

# Copy mobile application code
COPY mobile/ ./

# Expose server port
EXPOSE 3000

# Start production server
CMD ["npm", "start"]
