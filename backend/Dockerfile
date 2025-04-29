# Stage 1: Build
FROM node:22.14-alpine AS build 

# Set working directory
WORKDIR /app 

# Copy package files and install dependencies
COPY package*.json ./

#Cài đặt production dependencies nhanh hơn
RUN npm ci --only=production  

# Copy source files
COPY . .

# Stage 2: Production
FROM node:22.14-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app /app

# Expose port
EXPOSE 5001 

# Start servera
CMD ["npm", "start"]