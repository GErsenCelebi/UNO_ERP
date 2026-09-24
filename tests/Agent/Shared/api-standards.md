---
title: Enterprise API Standards
document: api-standards.md
version: 1.0
status: Approved
owner: TechLead (Architect)
reviewers:
  - Software Team Orchestrator
  - Backend Developer
---

# Enterprise API Standards

## Purpose
This document defines the **default API design and implementation standards** used by the Agentic AI Software Delivery Team across all ASP.NET Core REST API projects. 

Adhering to these standards ensures consistency, predictability, security, and ease of integration for frontend consumers and external partners.

---

## 1. Architectural Style
All web services must strictly adhere to **REST (Representational State Transfer)** principles.
*   **Protocol:** HTTP/HTTPS only (HTTPS strictly enforced).
*   **Format:** `application/json` for both Requests and Responses.
*   **Statelessness:** APIs must be completely stateless. Session state must not be stored on the server between requests.

---

## 2. URI & Route Design
URIs must be predictable, hierarchical, and intuitive.

### Rules:
*   **Nouns, not Verbs:** Use nouns to represent resources. Actions should be defined by the HTTP method, not the URL.
    *   ✅ **Correct:** `/api/v1/users`
    *   ❌ **Incorrect:** `/api/v1/getUsers` or `/api/v1/createUser`
*   **Pluralization:** Resource collections must be pluralized.
    *   ✅ **Correct:** `/api/v1/products`
    *   ❌ **Incorrect:** `/api/v1/product`
*   **Kebab-Case:** Use lowercase kebab-case for multi-word segments.
    *   ✅ **Correct:** `/api/v1/purchase-orders`
    *   ❌ **Incorrect:** `/api/v1/PurchaseOrders` or `/api/v1/purchase_orders`
*   **Hierarchy:** Nest resources to indicate relationships, but avoid nesting deeper than 2 levels.
    *   ✅ **Correct:** `/api/v1/users/123/orders`

---

## 3. HTTP Methods & Idempotency
Utilize standard HTTP verbs to perform CRUD operations on resources.

| Method | CRUD Action | Idempotent? | Description |
| :--- | :--- | :---: | :--- |
| **GET** | Read | Yes | Retrieves a resource or collection. Must never modify data. |
| **POST** | Create | No | Creates a new resource. Returns 201 Created with Location header. |
| **PUT** | Update (Replace) | Yes | Completely replaces an existing resource. |
| **PATCH** | Update (Partial) | No | Partially updates a resource (e.g., updating just an email). |
| **DELETE** | Delete | Yes | Removes a resource (Hard or Soft Delete). |

---

## 4. Standardized Status Codes
APIs must return appropriate HTTP status codes to indicate the outcome of the request.

### Success Codes (2xx)
*   `200 OK`: Successful GET, PUT, PATCH, or DELETE (if returning data).
*   `201 Created`: Successful POST. Must include a `Location` header pointing to the new resource.
*   `204 No Content`: Successful DELETE or PUT with no response body.

### Client Error Codes (4xx)
*   `400 Bad Request`: Validation failure or malformed payload.
*   `401 Unauthorized`: Missing or invalid JWT token.
*   `403 Forbidden`: Valid token, but user lacks necessary RBAC permissions/roles.
*   `404 Not Found`: The requested resource ID or route does not exist.
*   `409 Conflict`: Business rule violation (e.g., trying to create a user with an email that already exists).

### Server Error Codes (5xx)
*   `500 Internal Server Error`: An unhandled exception occurred. **Never expose stack traces in production.**

---

## 5. Standard Error Response Wrapper
When a `4xx` or `5xx` error occurs, the API must return a standardized JSON error wrapper.

```json
{
  "correlationId": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "errorCode": "VALIDATION_FAILED",
  "message": "One or more validation errors occurred.",
  "details": [
    {
      "field": "email",
      "issue": "The email format is invalid."
    }
  ]
}
```
*Note: `correlationId` must match the Serilog/AppInsights request tracking ID to easily trace errors from UI to backend logs.*

---

## 6. Pagination, Filtering, and Sorting
Collections returning multiple records must support cursor or offset pagination to prevent database timeouts.

### Query Parameters
*   **Pagination:** `?page=1&pageSize=20` (Default pageSize: 20, Max: 100)
*   **Sorting:** `?sortBy=createdAt&sortOrder=desc` (or `?sort=-createdAt`)
*   **Filtering:** `?status=active&department=sales`

### Paged Response Wrapper
When returning collections, wrap the data to include pagination metadata.
```json
{
  "data": [ ... ],
  "meta": {
    "currentPage": 1,
    "pageSize": 20,
    "totalItems": 145,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## 7. Versioning
All APIs must be explicitly versioned via the URI route.
*   ✅ **Pattern:** `/api/v{major}/{resource}`
*   ✅ **Example:** `/api/v1/invoices`

Minor/Non-breaking changes are handled within the same major version. Breaking changes (removing a field, changing a data type) require a new major version (e.g., `/api/v2/invoices`).

---

## 8. Authentication & Security
*   **JWT Only:** All APIs must be secured using JSON Web Tokens (JWT) passed via the `Authorization: Bearer <token>` HTTP header.
*   **Module-Level Scopes:** Authorization should be enforced server-side using ASP.NET Core `[Authorize(Policy = "...")]` or `[Authorize(Roles = "...")]` attributes based on the RBAC matrix.
*   **CORS:** APIs should have strict Cross-Origin Resource Sharing (CORS) policies configured to only allow requests from approved frontend domains.

---

## 9. OpenAPI / Swagger Documentation
**Swagger is mandatory and must be enabled by default.** It acts as the live contract between the Frontend and Backend teams.

Swagger must include:
*   Authentication endpoints and headers.
*   All available endpoints.
*   Request models and Response models (DTOs).
*   All possible status codes using `[ProducesResponseType]` (e.g., 200, 400, 401, 404).
*   XML comments (`/// <summary>`) detailing the purpose of each endpoint.

**Availability:**
Swagger should be reachable locally without additional configuration.
Example:
`https://localhost:5001/swagger`

---

## 10. Data Transfer Objects (DTOs)
*   **Never expose Domain Entities directly to the API.** Always map Entities to DTOs (e.g., using AutoMapper or Mapster).
*   This prevents accidental exposure of sensitive database fields (like `PasswordHash` or `IsDeleted`) and decouples the API contract from the database schema.
*   Naming: Use CamelCase for all JSON properties. (ASP.NET Core handles this automatically by default).
