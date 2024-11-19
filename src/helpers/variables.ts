import dotenv from 'dotenv'
dotenv.config()

const error = (variable: string) => {
    console.error(`Missing environment variable: ${variable}`)
    process.exit(1)
}

export class Api {
    public static readonly PORT = process.env.API_PORT || error('API_PORT')
    public static readonly HOST = process.env.API_HOST || error('API_HOST')
    public static readonly PASSWORD_SECRET = process.env.API_PASSWORD_SECRET || error('API_PASSWORD_SECRET')
}

export class MongoDB {
    public static readonly COLLECTION = process.env.MONGODB_COLLECTION || error('MONGODB_COLLECTION')
    public static readonly PASSWORD = process.env.MONGODB_PASSWORD || error('MONGODB_PASSWORD')
    public static readonly URI = process.env.HOST_DB || error('HOST_DB')
}

export class JWT {
    public static readonly SECRET = process.env.JWT_SECRET || error('JWT_SECRET')
    public static readonly EXPIRES_IN = process.env.JWT_EXPIRES_IN || error('JWT_EXPIRES_IN')
    public static readonly COOKIE_NAME = process.env.JWT_COOKIE_NAME || error('JWT_COOKIE_NAME')
    public static readonly ALGORITHM = process.env.JWT_ALGORITHM || error('JWT_ALGORITHM')
}

export class BOT {
    public static readonly KEY = process.env.BOT_KEY || error('BOT_KEY')
}

export class Endpoints {
    public static readonly AUTH_CLIENT = process.env.AUTH_CLIENT || error('AUTH_CLIENT')
    public static readonly AUTH_EMPLOYEE = process.env.AUTH_EMPLOYEE || error('AUTH_EMPLOYEE')
}

export class Stripe {
    public static readonly STRIPE_ID = process.env.STRIPE_ID || error('STRIPE_ID')
}

export class Host {
    public static readonly SHOP = process.env.HOST_SHOP || error('HOST_SHOP')
    public static readonly CLIENT = process.env.HOST_CLIENT || error('HOST_CLIENT')
    public static readonly FRONT = process.env.HOST_FRONT || error('HOST_FRONT')
}