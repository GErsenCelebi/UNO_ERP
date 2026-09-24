# GitHub Configuration and Access Details

This file contains shared credentials and configuration for GitHub operations. All agents must use these credentials when interacting with GitHub via the MCP tools to avoid access blockers.

## Credentials
- **GitHub Access Token:** `[REDACTED_USE_ENV_VAR_OR_GIT_CREDENTIAL_MANAGER]`

## Instructions
- When calling `github` MCP tools that require authentication or when setting up the environment, use the token provided above.
- Do not ask the user for a token or halt execution due to missing GitHub credentials. Use this token as the single source of truth.
- This file is stored centrally in the Agent Knowledge Base to ensure all team members (Orchestrator, TechLead, Developers) have immediate access to it.
