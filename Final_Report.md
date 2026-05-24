# Cybersecurity Internship Final Report
**Date:** 24 May 2026
**Project:** Securing a Vulnerable Web Application
**Submitted By**: Haseeb Ullah
**DHC Number**: 4385

## Executive Summary
This report summarizes the process of identifying, testing, and securing common vulnerabilities in a mock Node.js/Express web application. The tasks were divided across three weeks, focusing on assessment, implementation of security measures, and advanced logging/reporting.

## Week 1: Security Assessment
During the initial phase, the application was analyzed for security flaws. We utilized **OWASP ZAP** as an automated scanner to spider the application and identify potential weaknesses. Following the automated scan, manual testing confirmed the following critical vulnerabilities:
1.  **SQL Injection (SQLi):** The login route concatenated user input directly into the database query. By inputting `admin' OR '1'='1`, unauthorized access was granted.
2.  **Cross-Site Scripting (XSS):** The profile page rendered user input (`bio`) directly into the HTML without sanitization. Inputting `<script>alert('XSS')</script>` successfully executed unauthorized JavaScript in the browser.
3.  **Weak Password Storage:** Upon inspecting the source code, it was found that user passwords were saved in plain text in the SQLite database.

## Week 2: Implementing Security Measures
To remediate the vulnerabilities found in Week 1, several industry-standard NPM packages were integrated into the application:
1.  **Validator (`validator`):** Implemented to validate login input (ensuring it is alphanumeric) and to `escape()` the profile bio, effectively neutralizing the XSS vulnerability.
2.  **Password Hashing (`bcrypt`):** Integrated into the database setup to hash passwords before storing them. The login route was updated to use `bcrypt.compare()` for secure authentication.
3.  **Authentication Tokens (`jsonwebtoken`):** Implemented to issue a secure JWT token upon a successful login, enhancing the session management.
4.  **Secure Headers (`helmet`):** Added `helmet()` middleware globally to secure HTTP response headers and protect against common web vulnerabilities.

## Week 3: Advanced Security and Logging
1.  **Application Logging (`winston`):** Set up a robust logging system using `winston` to track application events. Logs are outputted to the console and saved to a `security.log` file, recording events such as application startup, successful logins, and failed login attempts.
2.  **Basic Penetration Testing:** The application was conceptually prepared for testing using tools like Nmap to ensure no unnecessary ports were exposed.


