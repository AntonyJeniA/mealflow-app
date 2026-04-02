# Use a lightweight Nginx image
FROM nginx:alpine

# Copy static website files to the default Nginx public directory
COPY . /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
