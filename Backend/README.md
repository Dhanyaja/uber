# Users API — Register Endpoint

This document describes the POST /users/register endpoint used to create a new user.

## Endpoint

- URL: `/users/register`
- Method: `POST`
- Content-Type: `application/json`

## Purpose

Register a new user by providing fullname (firstname and optional lastname), email, and password. The endpoint validates input, hashes the password, creates a user in the database, and returns an auth token and created user object (without password).

## Request body

JSON object with the following shape:

- `fullname` (object) — required
  - `firstname` (string) — required, minimum 3 characters
  - `lastname` (string) — optional, minimum 3 characters if provided
- `email` (string) — required, must be a valid email, minimum 5 characters
- `password` (string) — required, minimum 6 characters

Example request body:

{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "secret123"
}

Notes on validation (based on server-side validators in `routes/userRoute.js` and `models/user.model.js`):
- `email` uses express-validator's `isEmail()` check.
- `fullname.firstname` is validated to be at least 3 characters.
- `password` must be at least 6 characters.
- `models/user.model.js` enforces additional schema constraints and unique email at the database level.

## Responses

- 201 Created
  - Description: User was created successfully.
  - Body: `{ "token": <jwt>, "user": <user object> }` where `user.password` is not included.
  - Example:

    {
      "token": "<jwt-token>",
      "user": {
        "_id": "64a1b2c3d4e5f6...",
        "fullname": { "firstname": "John", "lastname": "Doe" },
        "email": "john.doe@example.com",
        "sockedId": null
      }
    }

- 400 Bad Request
  - Description: Validation failed for the request body.
  - Body: `{ "errors": [ { "msg": "<message>", "param": "<field>", ... } ] }`
  - Example:

    {
      "errors": [
        { "msg": "Invalid Email", "param": "email", "location": "body" }
      ]
    }

- 409 Conflict (or 400)
  - Description: Email already exists (unique constraint violation).
  - Body: `{ "message": "Email already in use" }` or database error details depending on error handling.

- 500 Internal Server Error
  - Description: An unexpected server/database error occurred.
  - Body: `{ "message": "Internal Server Error" }`

## Example cURL (PowerShell)

curl -Method POST -Uri "http://localhost:3000/users/register" -ContentType "application/json" -Body (
  ConvertTo-Json @{
    fullname = @{ firstname = 'John'; lastname = 'Doe' }
    email = 'john.doe@example.com'
    password = 'secret123'
  }
)

## Implementation notes

- Passwords are hashed by `user.model.js` static `hashPassword` before being stored (the controller currently calls `userModel.hashPassword` explicitly before passing the hashed password to the service).
- `userRoute.js` performs express-validator checks; the controller uses `validationResult` to collect validation errors and returns HTTP 400 with details.
- The service `createUser` builds the user document and calls `userModel.create`.
- The model `generateAuthToken` creates a JWT using `process.env.JWT_SECRET`.

## Testing

- Ensure MongoDB is running and `MONGODB_URI` (or your DB config) is set correctly.
- Set `JWT_SECRET` in your environment before starting the server.
- Start the server (from Backend folder):

  npm install
  npm run start

- Use the example above or a tool like Postman to POST to `/users/register` and verify responses.

## Troubleshooting

- Duplicate email errors: ensure the request email isn't already registered or drop the user document from the database while testing.
- Validation errors: follow the error messages returned in the 400 response.

---
Generated based on the server files in this repository (routes, controllers, services, and models).

## Login Endpoint

This document also covers the POST `/users/login` endpoint used to authenticate an existing user.

### Endpoint

- URL: `/users/login`
- Method: `POST`
- Content-Type: `application/json`

### Purpose

Authenticate a user with email and password. On success the server returns a JWT auth token and the user object (without password). On failure it returns validation errors or authentication errors.

### Request body

JSON object with the following fields:

- `email` (string) — required, must be a valid email
- `password` (string) — required, minimum 6 characters

Example request body:

{
  "email": "john.doe@example.com",
  "password": "secret123"
}

Validation notes (based on `routes/userRoute.js`):
- `email` uses express-validator's `isEmail()` check.
- `password` is validated to be at least 6 characters long.

### Responses

- 200 OK
  - Description: Authentication successful.
  - Body: `{ "token": <jwt>, "user": <user object> }`

- 400 Bad Request
  - Description: Validation failed for the request body.
  - Body: `{ "errors": [ { "msg": "<message>", "param": "<field>", ... } ] }`

- 401 Unauthorized
  - Description: Invalid credentials (email not found or password mismatch).
  - Body: `{ "message": "Invalid email or password" }` (actual message depends on controller implementation).

- 500 Internal Server Error
  - Description: An unexpected server/database error occurred.
  - Body: `{ "message": "Internal Server Error" }`

### Example cURL (PowerShell)

curl -Method POST -Uri "http://localhost:3000/users/login" -ContentType "application/json" -Body (
  ConvertTo-Json @{
    email = 'john.doe@example.com'
    password = 'secret123'
  }
)

### Implementation notes

- The route validators for login are defined in `routes/userRoute.js` and the controller should use `validationResult` to return errors when validation fails.
- The controller typically finds the user by email, compares the hashed password with `comparePassword`, and returns a token via `generateAuthToken` on success.

### Testing

- Ensure the registered user exists in the database before testing login.
- Use the provided cURL/PowerShell example or Postman to test success and failure cases.
