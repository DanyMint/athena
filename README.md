# Athena - Student Tracking SAAS 

## Table of Contents
1. [Project Overview](#project-overview)
2. [Project Setup](#project-setup)

---

## Project Overview

Athena is an open-source SAAS platform designed for tracking incoming students and managing grant award rankings. The system serves colleges and government institutions, providing comprehensive student registration and evaluation capabilities.

**Key Features:**
- Student registration and profile management
- Grant award ranking system
- Multi-tenant architecture for colleges
- Role-based access control
- Reporting and analytics dashboard

**Tech Stack:**
- **Backend:** Django 5.0+
- **API:** Django REST Framework 3.14+
- **Database:** PostgreSQL 15+
- **Cache:** Redis 7.2+

---

## Project Setup


### Prerequisites

Ensure you have the following installed:
- **Git:** Latest version
- **Docker & Docker Compose:** 24.0+ for containerized development

### Installation Steps

#### 1. Clone the Repository

~~~sh
git clone https://github.com/DanyMint/athena.git
~~~

#### 2. Go into direcoty

~~~sh
cd ./athena
~~~

#### 3. Add permissions `install.sh`

~~~sh
sudo chmod +x ./install.sh
~~~

#### 4. Environment Configuration

Edit `.env.sample` with your configuration:

```env
# Django Settings
ALLOWED_HOSTS="*"
DEBUG=True
CORS_ALLOW_ALL_ORIGINS=True
CORS_ALLOWED_ORIGINS='[]'

VITE_BACKEND_API_URL=/api/
#VITE_BACKEND_API_URL="http://domain/api/"

# Database Settings
## UNCOMMENT IF USE WITHOUT ATHENA-DEPLOY
POSTGRES_USER="athena"
POSTGRES_PASSWORD="pswd4athena"
POSTGRES_DB="athena_db"
POSTGRES_PORT=5432
POSTGRES_HOST="athena_ps_db"

```

#### 5. Run installation

~~~sh
sudo ./install.sh
~~~

