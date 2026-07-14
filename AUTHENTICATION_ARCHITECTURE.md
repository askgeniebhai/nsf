# NSF Authentication & Authorization Architecture - Phase 1

## Overview
This document outlines the Phase 1 implementation of the authentication and administration foundation for the Neela Security Force (NSF) portal. This implementation is entirely front-end based, utilizing `localStorage` to mock session persistence.

## Roles and Access Control
The system enforces strict Role-Based Access Control (RBAC).

*   **Administrator (`admin`)**: Full access to all administrative routes (dashboard, live tracking, attendance logs, payroll, reports, settings).
*   **Supervisor (`supervisor`)**: Access restricted to the supervisor control panel (dashboard, team attendance, team management).
*   **Security Personnel (`guard`)**: Access restricted to the guard self-service portal (dashboard, mark attendance, patrol logs, incident reporting).
*   **Client (`client`)**: Access restricted to the client overview dashboard.

## Route Protection
All routes within the `admin/`, `supervisor/`, `guard/`, `client/`, and `portals/` directories are protected using the `AuthService.checkAuth(requiredRole)` method.

1.  **Execution Phase**: The `checkAuth` method runs immediately when the script loads in the `<head>` or at the end of the `<body>`.
2.  **Validation Check**: It reads the `nsf_user` object from `localStorage`.
3.  **Role Verification**: If the user is unauthenticated OR their role does not exactly match the `requiredRole` passed to the function, they are immediately redirected to the root `login.html` page.

## Session Management
Sessions are stored in `localStorage` under the key `nsf_user`.

*   **Data Stored**: `id` (username), `role`, `name`, and `loggedInAt` (ISO timestamp).
*   **Expiration**: The `checkAuth` method includes a 24-hour expiration check. If the difference between the current time and `loggedInAt` exceeds 24 hours, the session is invalidated, storage is cleared, and the user is redirected to login.

## Login Flow
1.  User enters credentials on `login.html`.
2.  The form intercepts the submit event and passes credentials to `AuthService.login()`.
3.  A mock 500ms delay simulates network latency. The button transitions to a "Authenticating..." state.
4.  Credentials are validated against hardcoded values for Phase 1.
5.  If validation fails, an inline error message is displayed (no disruptive alerts).
6.  If validation succeeds, the session is written to `localStorage` and the user is redirected to their specific role dashboard.

## Logout Flow
1.  User clicks the "Logout" button.
2.  `AuthService.logout()` is invoked.
3.  The `nsf_user` key is removed from `localStorage`.
4.  A loop iterates over `localStorage` to remove any associated session state, such as active duty flags (`nsf_active_duty_...`) or live location tracking (`nsf_live_location_...`).
5.  The user is redirected back to `login.html`.
