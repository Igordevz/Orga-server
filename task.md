# API Interaction Guide for AI

This document outlines how an AI can interact with the API to perform operations on Workspaces and Pages. All API calls require authentication via a JWT token.

## Authentication

All listed endpoints require a valid JWT token to be passed in the request. The token is typically set as a cookie named `refreshToken`.

---

## Workspaces

### 1. Create a New Workspace

*   **Controller:** `src/controllers/workspace/new-workspace.ts`
*   **Method:** `POST`
*   **Endpoint:** `/workspace`
*   **Authentication:** Required (`validateToken`)
*   **Request Body (JSON):**
    ```json
    {
        "name": "string" // The desired name for the new workspace (min 2, max 100 characters)
    }
    ```
*   **Example Response (201 Created):**
    ```json
    {
        "workspace": {
            "id": "string (UUID)",
            "name": "string",
            "slug": "string",
            "ownerId": "string (UUID)",
            "createdAt": "ISO 8601 string",
            "updatedAt": "ISO 8601 string"
        },
        "message": "workspace criada com sucesso!"
    }
    ```

### 2. Read a Workspace by Slug

*   **Controller:** `src/controllers/workspace/get-slug-workspace.ts`
*   **Method:** `GET`
*   **Endpoint:** `/workspace/:slug` (replace `:slug` with the actual workspace slug)
*   **Authentication:** Required (`validateToken`)
*   **URL Parameters:**
    *   `slug`: The unique slug identifier of the workspace.
*   **Example Response (200 OK):**
    ```json
    {
        "id": "string (UUID)",
        "name": "string",
        "slug": "string",
        "ownerId": "string (UUID)",
        "createdAt": "ISO 8601 string",
        "updatedAt": "ISO 8601 string",
        "memberships": [...], // Array of membership objects
        "pages": [...]        // Array of page objects associated with the workspace
    }
    ```
*   **Error Response (404 Not Found):**
    ```json
    {
        "error": "Workspace not found"
    }
    ```

### 3. Rename a Workspace

*   **Controller:** `src/controllers/workspace/rename-workspace.ts`
*   **Method:** `PUT`
*   **Endpoint:** `/workspace/:slug` (replace `:slug` with the current workspace slug)
*   **Authentication:** Required (`validateToken`)
*   **URL Parameters:**
    *   `slug`: The current unique slug identifier of the workspace to rename.
*   **Request Body (JSON):**
    ```json
    {
        "name": "string" // The new desired name for the workspace (min 2, max 100 characters)
    }
    ```
*   **Example Response (200 OK):**
    ```json
    {
        "workspace": {
            "id": "string (UUID)",
            "name": "string (new name)",
            "slug": "string (new slug, possibly updated)",
            "ownerId": "string (UUID)",
            "createdAt": "ISO 8601 string",
            "updatedAt": "ISO 8601 string"
        },
        "message": "Workspace renomeado com sucesso!"
    }
    ```
*   **Error Response (404 Not Found):**
    ```json
    {
        "error": "Workspace não encontrado"
    }
    ```
*   **Error Response (403 Forbidden):**
    ```json
    {
        "error": "Você não é o proprietário deste workspace"
    }
    ```

---

## Pages

### 1. Create a New Page

*   **Controller:** `src/controllers/pages/create-page.ts`
*   **Method:** `POST`
*   **Endpoint:** `/page`
*   **Authentication:** Implied by `createPagetoWork` controller, check `src/routes/page.ts` for actual `preHandler`. (Note: `src/routes/page.ts` does not explicitly list `validateToken` for this route, AI should verify if authentication is required by the server setup).
*   **Request Body (JSON):**
    ```json
    {
        "title": "string",       // The title of the page (min 1 character)
        "icon": "string",        // The icon for the page (min 1 character)
        "coverImage": "string",  // Optional: URL or path to a cover image
        "data": "string",        // The content/data of the page
        "workspaceId": "string"  // The ID of the workspace this page belongs to
    }
    ```
*   **Example Response (200 OK):**
    ```json
    {
        "status": "success",
        "data": {
            "id": "string (UUID)",
            "title": "string",
            "icon": "string",
            "coverImage": "string | null",
            "data": "string",
            "workspaceId": "string (UUID)",
            "isArchived": "boolean",
            "createdAt": "ISO 8601 string",
            "updatedAt": "ISO 8601 string"
        }
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
        "error": "Erro ao criar página" // Or other internal server error messages
    }
    ```

### 2. Update a Page

*   **Controller:** `src/controllers/pages/update-page.ts`
*   **Method:** `PUT`
*   **Endpoint:** `/page`
*   **Authentication:** Required (`validateToken` should be applied at the route level).
*   **Request Body (JSON):**
    ```json
    {
        "id": "string",          // Required: The ID of the page to update
        "title": "string",       // Optional: The new title of the page (min 1 character)
        "icon": "string",        // Optional: The new icon for the page (min 1 character)
        "coverImage": "string",  // Optional: New URL or path to a cover image
        "data": "string",        // Optional: The new content/data of the page
        "workspaceId": "string"  // Optional: The ID of the workspace this page belongs to
    }
    ```
*   **Example Response (200 OK):**
    ```json
    {
        "status": "success",
        "data": {
            "id": "string (UUID)",
            "title": "string",
            "icon": "string",
            "coverImage": "string | null",
            "data": "string",
            "workspaceId": "string (UUID)",
            "isArchived": "boolean",
            "createdAt": "ISO 8601 string",
            "updatedAt": "ISO 8601 string"
        }
    }
    ```
*   **Error Response (500 Internal Server Error):**
    ```json
    {
        "error": "Erro ao atualizar página ou página não encontrada"
    }
    ```

