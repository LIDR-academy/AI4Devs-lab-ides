FROM node:18-alpine

# Install necessary tools including OpenSSL
RUN apk add --no-cache netcat-openbsd openssl

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Copy tsconfig.json
COPY tsconfig.json ./

# Generate Prisma client
RUN npx prisma generate

# Copy initialization script
COPY docker-init.sh ./
RUN chmod +x docker-init.sh

# Copy application code
COPY . .

# Run Prisma generate again after copying all code
RUN npx prisma generate

# Build the application with skipLibCheck to avoid errors in node_modules
RUN npm run build

# Expose the port
EXPOSE 3010

# Command to run the application using the init script
CMD ["./docker-init.sh"]