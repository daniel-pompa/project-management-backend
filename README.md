# Project Management Backend

The backend for the Project Management application is built using **Node.js**, **Express**, **Mongoose**, and **TypeScript**. This REST API is designed to support a comprehensive web application that streamlines project and task management within a development team, ensuring efficient team collaboration and secure data handling.

Key features of this backend include:

- **Project and Task Management**: Allows project managers to create and manage projects, as well as the tasks associated with each project. This includes updating or deleting tasks and tracking their histories for effective progress monitoring.
- **User Management**: Supports user registration, account confirmation, and role-based authentication to ensure appropriate access control. Users can update their profiles, including their name, email, and password.
- **Team Collaboration**: Facilitates team developers in completing tasks, updating task statuses, and adding notes, while restricting their ability to edit or delete projects or tasks, which is reserved for project managers.
- **Security Measures**: Ensures secure deletion of projects by requiring the project manager to authenticate their identity through their account password.

By leveraging these technologies, the backend ensures robust and scalable features that enhance project management efficiency and team collaboration, while maintaining reliable and secure client-server communication.

## Table of Contents

1. [Requirements](#requirements)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Installation](#installation)
5. [API Documentation](#api-documentation)
6. [Contributing](#contributing)
7. [License](#license)
8. [Author](#author)

## Requirements

You need to have the following installed:

A source code editor such as [VSCode](https://code.visualstudio.com/), [Sublime Text](https://www.sublimetext.com/), or any other editor of your choice.

[![NodeJS](https://img.shields.io/badge/Node.js-6DA55F.svg?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/en)
[![npm](https://img.shields.io/badge/npm-%23CB3837.svg?style=flat&logo=npm&logoColor=white)](https://www.npmjs.com/)

> [!NOTE]
> Clicking on the Node.js badge will take you to the Node.js website, where you can download the installer. It is recommended to use the stable version. When you install Node.js, npm will be installed automatically.

Check your Node.js and npm installation by running:

```bash
node --version
npm --version
```

## Technology Stack

<p>
  <img src="https://skillicons.dev/icons?i=nodejs" alt="Node.js" width="40" height="40" />
  <img src="https://skillicons.dev/icons?i=express" alt="Express" width="40" height="40" />
  <img src="https://skillicons.dev/icons?i=mongodb" alt="MongoDB" width="40" height="40" />
  <img src="https://skillicons.dev/icons?i=ts" alt="TypeScript" width="40" height="40" />
</p>

- **Node.js**: A free, open-source, cross-platform JavaScript runtime environment that lets developers create servers, web apps, command line tools and scripts.
- **Express.js**: A flexible Node.js framework that simplifies server-side development, handling routing, middleware, and API management.
- **MongoDB**: A NoSQL database that offers flexible data modeling and efficient querying, ideal for managing dynamic project data.
- **Mongoose**: An ODM library for MongoDB and Node.js that facilitates data validation and schema management, enhancing development efficiency.
- **TypeScript**: Adds static typing to JavaScript, improving code quality and maintainability.

## Project Structure

```bash
├───📁 src/
│   ├───📁 config/
│   ├───📁 controllers/
│   ├───📁 emails/
│   ├───📁 middlewares/
│   ├───📁 models/
│   ├───📁 routes/
│   ├───📁 utils/
│   ├───📄 index.ts
│   └───📄 server.ts
├───📄 .env.template
├───📄 LICENSE
├───📄 package-lock.json
├───📄 package.json
├───📄 README.md
└───📄 tsconfig.json
```

## Installation

To set up the backend locally, follow these steps:

1. **Clone the repository:**

```bash
git clone https://github.com/daniel-pompa/project-management-backend.git
```

2. **Navigate to the project directory:**

```bash
cd project-management-backend
```

3. **Install dependencies:**

```bash
npm install
```

4. Create an `.env` file in the root of the project and set the necessary environment variables. You can use the `.env.template` file as a reference.

5. **Run the development server:**

```bash
npm run dev
```

## API Documentation

The API documentation is available via **Swagger UI**, providing a comprehensive reference for all endpoints and their usage. Access it through the following URLs:

- **Development**: [localhost:4000/docs](http://localhost:4000/docs)

> [!NOTE]
> Ensure the server is running locally to access the documentation in development.

- **Production**: [API Documentation](https://project-management-backend-kvhy.onrender.com/docs)

In production, no additional setup is required, as the backend is deployed and continuously running on Render.

## Base URL

The base URL for the API is: `http://localhost:4000/api`

## Authentication

> [!NOTE]
> Some endpoints require a Bearer token to be included in the Authorization header. The endpoints that require authentication are clearly indicated below.

### Authentication and User Management Endpoints

| Method | Endpoint                 | Description                                       | Auth Required        |
|--------|--------------------------|---------------------------------------------------|----------------------|
| POST   | `/create-account`        | Create a new user account.                        | No                   |
| POST   | `/confirm-account`       | Confirm a user account using a token.             | No                   |
| POST   | `/login`                 | Authenticate a user and return a JWT token.       | No                   |
| POST   | `/request-code`          | Request a confirmation code for account recovery. | No                   |
| POST   | `/reset-password`        | Initiate the password reset process.              | No                   |
| POST   | `/verify-token`          | Verify a token used for password reset.           | No                   |
| POST   | `/reset-password/{token}`| Reset password using the provided token.          | No                   |
| GET    | `/user`                  | Get details of the authenticated user.            | Yes                  |
| PUT    | `/profile`               | Update the authenticated user's profile.          | Yes                  |
| POST   | `/update-password`       | Update the user's password.                       | Yes                  |
| POST   | `/check-password`        | Verify if the provided password is correct.       | Yes                  |

### Project Management Endpoints

| Method | Endpoint                     | Description                                    | Auth Required        |
|--------|------------------------------|------------------------------------------------|----------------------|
| POST   | `/projects`                  | Create a new project.                          | Yes                  |
| GET    | `/projects`                  | Retrieve all projects.                         | Yes                  |
| GET    | `/projects/{projectId}`      | Retrieve a specific project by its ID.         | Yes                  |
| PUT    | `/projects/{projectId}`      | Update a project.                              | Yes                  |
| DELETE | `/projects/{projectId}`      | Delete a project.                              | Yes                  |

### Task Management Endpoints

| Method | Endpoint                                      | Description                                | Auth Required        |
|--------|-----------------------------------------------|--------------------------------------------|----------------------|
| POST   | `/projects/{projectId}/tasks`                 | Create a new task for a project.           | Yes                  |
| GET    | `/projects/{projectId}/tasks`                 | Retrieve all tasks for a specific project. | Yes                  |
| GET    | `/projects/{projectId}/tasks/{taskId}`        | Retrieve a specific task by its ID.        | Yes                  |
| PUT    | `/projects/{projectId}/tasks/{taskId}`        | Update a task.                             | Yes                  |
| DELETE | `/projects/{projectId}/tasks/{taskId}`        | Delete a task.                             | Yes                  |
| PUT    | `/projects/{projectId}/tasks/{taskId}/status` | Update the status of a specific task.      | Yes                  |

### Team Management Endpoints

| Method | Endpoint                              | Description                                    | Auth Required        |
|--------|---------------------------------------|------------------------------------------------|----------------------|
| GET    | `/projects/{projectId}/team`          | Retrieve the team members for a project.       | Yes                  |
| POST   | `/projects/{projectId}/team`          | Add a team member to a project.                | Yes                  |
| DELETE | `/projects/{projectId}/team/{userId}` | Remove a team member from a project.           | Yes                  |
| POST   | `/projects/{projectId}/team/find`     | Find a team member by their email.             | Yes                  |

### Note Management Endpoints

| Method | Endpoint                                              | Description                                         | Auth Required        |
|--------|-------------------------------------------------------|-----------------------------------------------------|----------------------|
| POST   | `/projects/{projectId}/tasks/{taskId}/notes`          | Create a new note for a specific task.              | Yes                  |
| GET    | `/projects/{projectId}/tasks/{taskId}/notes`          | Retrieve all notes associated with a specific task. | Yes                  |
| DELETE | `/projects/{projectId}/tasks/{taskId}/notes/{noteId}` | Delete a note.                                      | Yes                  |

### Response Codes

| Code  | Description                                                                |
|-------|----------------------------------------------------------------------------|
| 200   | OK - Request was successful.                                               |
| 201   | Created - Resource created successfully.                                   |
| 204   | No Content - Resource deleted successfully.                                |
| 400   | Bad Request - Validation errors.                                           |
| 401   | Unauthorized - User is not authenticated or does not have permission.      |
| 404   | Not Found - Resource not found.                                            |
| 409   | Conflict - Request could not be processed due to a conflict in the request |

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

Before submitting a pull request, please ensure your code follows the project's coding standards and includes tests where appropriate.

## License

This project is licensed under the MIT License.

[![MIT License](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://choosealicense.com/licenses/mit/)

> [!NOTE]
> Clicking on the MIT License badge will take you to the LICENSE file for details.

## Author

This project is maintained and developed by **Daniel Pompa Pareja**.

For any questions or suggestions, feel free to reach out via [email](mailto:daniel.40.pompa@gmail.com).

[Back to Top](#table-of-contents)
