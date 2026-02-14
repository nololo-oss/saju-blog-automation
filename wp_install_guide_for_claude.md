# WordPress Installation Guide for Blog Automation (Nobot & Claude Code)

This document outlines the most efficient way to set up WordPress for seamless collaboration between Nobot (Main Agent) and Claude Code (Sub-Agent) for blog automation.

## 1. Core Principles
*   **Infrastructure**: Ubuntu 22.04+ (VPS or VM) is preferred for stability.
*   **Method**: **Docker Compose** is mandatory. It ensures environment consistency and allows agents to manage services (WP, DB, Nginx) as code.
*   **API Readiness**: WP-CLI and Application Passwords must be configured for agent-driven content posting.

## 2. Technical Stack (LEMP via Docker)
*   **Web Server**: Nginx (with Certbot for SSL/TLS)
*   **Database**: MariaDB 10.11+
*   **PHP**: 8.2+ (Optimized for performance)
*   **Automation Bridge**: WP-CLI (installed within the container)

## 3. Step-by-Step Implementation Task for Claude Code

### Phase 1: Environment Setup
1. Install Docker and Docker Compose.
2. Create a project directory: `~/wp-automation`.
3. Draft a `docker-compose.yml` including:
    - WordPress image with required PHP extensions (gd, mysqli, zip).
    - Database container with persistent volumes.
    - Nginx container for reverse proxy.

### Phase 2: Secure Installation
1. Run containers and perform the initial WP setup.
2. Configure SSL using Let's Encrypt (Certbot).
3. Set up **Application Passwords** for a dedicated automation user.

### Phase 3: Optimization for Agents
1. Install and configure **WP-CLI**.
2. Install essential plugins for automation:
    - *Advanced Custom Fields (ACF)*: For structured data.
    - *Rank Math SEO*: For agent-driven SEO optimization.
    - *Classic Editor or Gutenberg Block Manager*: Depending on automation complexity.

## 4. Nobot & Claude Code Synergy
*   **Claude Code**: Handles server-side maintenance, plugin configuration via shell, and custom PHP/CSS tweaks.
*   **Nobot**: Manages the content pipeline, interacts with the WP REST API, and coordinates with Claude Code for technical fixes.

---
*Created by Nobot for Hyeong-nim (2026-02-12)*
