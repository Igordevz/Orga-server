# Orga Server

This is the server for the Orga application.

## Getting Started

To install dependencies:

```bash
bun install
```

To run the development server:

```bash
bun --watch src/http/server.ts
```

This project was created using `bun init` in bun v1.2.20. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## API Documentation

### Authentication

- **POST** `/auth/register` - Register a new user.
  - **Body**:
    - `name` (string, required): The user's name.
    - `email` (string, required): The user's email.
    - `password` (string, required): The user's password.
- **POST** `/auth/login` - Authenticate a user with email and password.
  - **Body**:
    - `email` (string, required): The user's email.
    - `password` (string, required): The user's password.
- **GET** `/auth/github/callback` - GitHub authentication callback.
- **GET** `/user` - Get the authenticated user's information.
  - **Headers**:
    - `Authorization`: `Bearer <token>`

### Workspaces

- **POST** `/workspace` - Create a new workspace.
  - **Headers**:
    - `Authorization`: `Bearer <token>`
  - **Body**:
    - `name` (string, required): The name of the workspace.
- **GET** `/workspace/:slug` - Get a workspace by its slug.
  - **Headers**:
    - `Authorization`: `Bearer <token>`
- **PUT** `/workspace/:slug` - Rename a workspace.
  - **Headers**:
    - `Authorization`: `Bearer <token>`
  - **Body**:
    - `name` (string, required): The new name of the workspace.

### Pages

- **POST** `/page` - Create a new page.
  - **Body**:
    - `title` (string, required): The title of the page.
    - `icon` (string, required): The icon of the page.
    - `coverImage` (string, optional): The cover image of the page.
    - `data` (string, required): The content of the page.
    - `workspaceId` (string, required): The ID of the workspace the page belongs to.