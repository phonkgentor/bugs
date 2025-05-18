# Use an official Node.js runtime as a parent image
FROM node:16

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port (Render assigns port via environment variable)
EXPOSE $PORT

# Define environment variable
ENV PORT $PORT

# Start the app
CMD [ "npm", "start" ]
