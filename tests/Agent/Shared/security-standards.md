---
title: Enterprise Security Standards
document: security-standards.md
version: 1.0
status: Approved
owner: TechLead (Architect)
reviewers:
  - Software Team Orchestrator
  - Business Analyst
---

# Enterprise Security Standards

## Purpose
This document establishes the security baseline for all applications engineered by the Agentic AI Software Delivery Team. It aims to protect data integrity, prevent unauthorized access, and ensure compliance with global regulatory standards (e.g., GDPR, SOC-2).

---

## 1. Authentication & Identity
*   **JSON Web Tokens (JWT):** All API authentication must be handled statelessly via JWTs transmitted in the `Authorization: Bearer` header.
*   **Token Security:** 
    *   JWTs must have a strict expiration time (e.g., 1 hour).
    *   For Frontends, tokens should ideally be stored in `HttpOnly`, `Secure` cookies to prevent Cross-Site Scripting (XSS) extraction. If stored in memory/localStorage, extreme XSS mitigations must be in place.
*   **Passwords:** Passwords must never be stored in plain text. Always use strong, salted hashes natively provided by `ASP.NET Core Identity` (e.g., PBKDF2, Argon2).

---

## 2. Authorization & Access Control (RBAC)
*   **Server-Side Enforcement:** UI hiding (e.g., hiding a "Delete" button in React) is for UX only. True authorization **must** be enforced on the backend via ASP.NET Core `[Authorize]` attributes.
*   **Principle of Least Privilege:** Users must be granted the absolute minimum permissions necessary to perform their required tasks.
*   **Broken Access Control:** Implement strict tenant/ownership checks. A user passing a valid `ID` parameter to `/api/v1/orders/{id}` must explicitly own or have administrative rights to that specific order ID.

---

## 3. Data Protection & Privacy
*   **Soft Deletion (GDPR Compliance):** Database tables must implement an `IsDeleted` flag. Hard physical deletions are prohibited unless explicitly required for regulatory data-purging.
*   **Data Masking:** PII (Personally Identifiable Information), financial data, and health data must never be dumped into system logs.
*   **Encryption in Transit:** All traffic must be forced over HTTPS/TLS 1.2+. HTTP traffic must be permanently redirected.

---

## 4. Configuration & Secrets Management
*   **No Hardcoded Secrets:** Connection strings, API keys, JWT Signing Keys, and passwords must **never** be hardcoded in the codebase or committed to source control (e.g., no secrets in `appsettings.json`).
*   **Environment Injection:** Secrets must be injected securely at runtime via Environment Variables, Azure KeyVault, or CI/CD secret injection.

---

## 5. API Hardening
*   **CORS (Cross-Origin Resource Sharing):** Wildcard `*` origins are strictly forbidden in production. CORS policies must explicitly whitelist known, trusted frontend domains.
*   **Rate Limiting:** Publicly accessible endpoints (especially Authentication endpoints like `/api/login`) must implement Rate Limiting to prevent Brute Force and DDoS attacks.
*   **Input Validation:** Never trust client input. Implement strict validation schemas (using `FluentValidation` in the backend) before processing any DTOs.
*   **SQL Injection:** Always use Entity Framework Core LINQ or parameterized queries (e.g., Dapper). Never concatenate strings to build raw SQL statements.
