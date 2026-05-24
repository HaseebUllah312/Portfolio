# Week 1: Security Assessment Report

## Overview
This document outlines the findings from the basic vulnerability assessment performed on the User Management System.

## Vulnerabilities Found

1.  **Cross-Site Scripting (XSS)**
    *   **Location:** Profile bio section (`/profile` endpoint).
    *   **Description:** The application renders user input directly into the HTML without sanitization or escaping.
    *   **Proof of Concept:** Entering `<script>alert('You have been hacked via XSS!');</script>` into the bio field successfully executed the JavaScript code in the browser.

2.  **SQL Injection (SQLi)**
    *   **Location:** Login form (`/login` endpoint).
    *   **Description:** The application concatenates user input directly into the SQL query used for authentication, allowing attackers to manipulate the query logic.
    *   **Proof of Concept:** Entering `admin' OR '1'='1` in the username field bypassed the password check and allowed unauthorized access to the admin account.

3.  **Weak Password Storage**
    *   **Location:** Database (`users` table).
    *   **Description:** User passwords are currently stored in plain text. If the database is compromised, all user passwords will be immediately exposed.

## Areas of Improvement

To secure the application, the following measures must be implemented:

1.  **Input Sanitization and Validation:** Use libraries like `validator` to ensure all user inputs are properly formatted and safe before processing them. We must escape HTML characters to prevent XSS.
2.  **Secure Database Queries:** Implement parameterized queries or prepared statements to prevent SQL Injection attacks.
3.  **Password Hashing:** Use a strong hashing algorithm like `bcrypt` to hash passwords before storing them in the database. Never store plain text passwords.
4.  **Enhanced Authentication:** Implement a robust authentication mechanism, such as token-based authentication using JSON Web Tokens (JWT).
5.  **Secure HTTP Headers:** Utilize middleware like `helmet.js` to set secure HTTP headers and protect against well-known web vulnerabilities.
