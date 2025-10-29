function App() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1> React App Dockerized with Multi-Stage Build</h1>
      <p>Served using Nginx</p>
    </div>
  );
}

export default App;
# ---------------------------
# STAGE 1: Build the React app
# ---------------------------
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY my-react-app/package*.json ./
RUN npm install

# Copy the rest of the source code
COPY my-react-app/ .

# Build the React app for production
RUN npm run build


# ---------------------------
# STAGE 2: Serve with Nginx
# ---------------------------
FROM nginx:alpine

# Copy build output from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
