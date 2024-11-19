# About the App

This is the server for an online shop application. It performs tasks such as:
- Handling client requests (managing products, purchasing products, retrieving product lists, and more),
- Handling Bot requests (retrieving product lists),
- Handling Admin requests (managing data in the database).

# Shop API Configuration

To run the project, you need to create and complete the `.env` file with the following environment variables:

```env
# API Configuration
API_PORT={Your Shop API port}
API_HOST={Your Shop host, e.g., `localhost`}
API_PASSWORD_SECRET={random string}

# MongoDB Configuration
MONGODB_COLLECTION=SHOP
MONGODB_PASSWORD={Your MongoDB password}
HOST_DB={e.g., `mongodb://localhost:27017/SHOP`}

# JWT Configuration
JWT_COOKIE_NAME=music-store-cookie
JWT_SECRET={random string}
JWT_EXPIRES_IN=90d
JWT_ALGORITHM=HS256

# Authentication Services
AUTH_CLIENT="{Client API host, e.g., `localhost:8080`}/auth/verify"
AUTH_EMPLOYEE="{Employee API host, e.g., `localhost:8000`}/auth/verify"

# Bot API Key
BOT_KEY={random string - must match the BOT API key}

# Stripe API Configuration
STRIPE_ID={Stripe API ID}

# Application Hosts
HOST_SHOP={e.g., `http://localhost:8080`}
HOST_FRONT={e.g., `http://localhost:8080`}
HOST_CLIENT={e.g., `http://localhost:8080`}
```

And install modules: `npm install`
