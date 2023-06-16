# QUISIIN BACK END SERVICE

This is the backend API for our application built with Express.js. It provides the necessary endpoints to interact with the application's data.

![Banner Image](https://storage.googleapis.com/bangkit-capstone-c23-pc667-user-bucket/other/QUISIIN_C23-PC667.gslides.png)

## Description

The Backend API Express project is responsible for handling the server-side logic and data management of our application. It exposes a set of RESTful APIs that allow clients to perform various operations such as creating, reading, updating, and deleting data.

## Features

- User authentication and authorization
- CRUD operations for various resources
- Integration with external services (Cloudstorage, Cloud SQL, Cloud Run, Swagger UI)

## Link to Download App

To download the frontend application that interacts with this backend API, please visit [Frontend App Repository](https://github.com/Bangkit-Capstone-C23-PC667/FE-Capstone-Project).

## Roles and Team Members

- Project Manager: Muhammad Rafly Alfayed ([GitHub](https://github.com/Fayed06))
- Backend Developer: Muhammad Rafly Alfayed ([GitHub](https://github.com/Fayed06)), Faruq Putra R ([GitHub](https://github.com/Faruqpr))
- Cloud Engineer: Muhammad Rafly Alfayed ([GitHub](https://github.com/Fayed06)), Faruq Putra R ([GitHub](https://github.com/Faruqpr))

## Tech Stack

The following technologies and frameworks are used in this project:

- Express.js: Fast and minimalist web application framework for Node.js
- Cloud SQL : database for storing and managing application data
- JSON Web Tokens (JWT): Used for user authentication and authorization
- Google Cloud Storage For storing and managing file uploads
- Docker: Containerization platform for easy deployment and scalability
- Git: Version control system for collaborative development
- CI/CD: Continuous integration and deployment pipelines for automating the build and deployment process

## Getting Started

To run the backend API locally, follow these steps:

1. Clone the repository: `git clone https://github.com/Bangkit-Capstone-C23-PC667/BE-Capstone-Project.git`
2. Install dependencies: `npm install`
3. Configure environment variables (e.g., database connection, API keys)
4. Start the server: `npm start`
5. Access the API at `http://localhost:3000`

## Docker Local Development

To run the backend API using Docker for local development, follow these steps:

1. Install Docker on your machine: [Install Docker](https://docs.docker.com/get-docker/)
2. Clone the repository: `git clone https://github.com/Bangkit-Capstone-C23-PC667/BE-Capstone-Project.git`
3. Navigate to the project directory: `cd BE-Capstone-Project`
4. Build the Docker image: `docker build -t backend-api .`
5. Run the Docker container: `docker run -p 3000:3000 backend-api`
6. Access the API at `http://localhost:3000`

The backend API should now be running inside the Docker container, and you can interact with it as usual.

## API Documentation

For detailed documentation on the available API endpoints and their usage, please refer to the [API Documentation]( https://be-capstone-project-aethyk4pbq-et.a.run.app/).

