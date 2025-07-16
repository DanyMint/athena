from os import getenv, path
from pathlib import Path
from dotenv import load_dotenv
from django.core.management.utils import get_random_secret_key
# from json import loads
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = getenv('SECRET_KEY', get_random_secret_key())
DEBUG = bool(getenv("DEBUG"))

ALLOWED_HOSTS = getenv('ALLOWED_HOSTS', '').split(',')

# CORS settings
CORS_ALLOW_ALL_ORIGINS = bool(getenv("CORS_ALLOW_ALL_ORIGINS"))
CSRF_TRUSTED_ORIGINS = getenv('CSRF_TRUSTED_ORIGINS', 'http://localhost:3000,http://localhost,http://127.0.0.1').split(',')
CORS_ALLOWED_ORIGINS = getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost,http://127.0.0.1').split(',')

# Session and Cookie security
SESSION_COOKIE_SECURE = bool(getenv('SESSION_COOKIE_SECURE', ''))
CSRF_COOKIE_SECURE = bool(getenv('CSRF_COOKIE_SECURE', ''))
SESSION_COOKIE_SAMESITE = getenv('SESSION_COOKIE_SAMESITE', 'Lax')
CSRF_COOKIE_SAMESITE = getenv('CSRF_COOKIE_SAMESITE', 'Lax')
SECURE_PROXY_SSL_HEADER = None
SESSION_COOKIE_DOMAIN = None
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_COOKIE_AGE = int(getenv('SESSION_COOKIE_AGE', '86400'))
SESSION_SAVE_EVERY_REQUEST = bool(getenv('SESSION_SAVE_EVERY_REQUEST', 'True'))
SESSION_EXPIRE_AT_BROWSER_CLOSE = bool(getenv('SESSION_EXPIRE_AT_BROWSER_CLOSE', ''))

# Security settings
SECURE_HSTS_SECONDS = int(getenv('SECURE_HSTS_SECONDS', '3600'))
SECURE_SSL_REDIRECT = bool(getenv('SECURE_SSL_REDIRECT', ''))
SECURE_HSTS_PRELOAD = bool(getenv('SECURE_HSTS_PRELOAD', ''))
SECURE_HSTS_INCLUDE_SUBDOMAINS = bool(getenv('SECURE_HSTS_INCLUDE_SUBDOMAINS', ''))

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'admissions',
    'admissions_api',
    'rest_framework',
    'django_filters',
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        'NAME':  getenv("POSTGRES_DB"),
        'USER': getenv("POSTGRES_USER"),
        'PASSWORD': getenv("POSTGRES_PASSWORD"),
        'HOST': getenv("POSTGRES_HOST"),
        'PORT': getenv("POSTGRES_PORT")
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = path.join(BASE_DIR, 'staticfiles')

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
}


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.security.csrf': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
