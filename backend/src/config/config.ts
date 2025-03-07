import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Interface for our configuration to ensure type safety
interface Config {
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    DB_URI: string;
    PORT: number;
    STRIPE_SECRET_KEY: string;
    CLIENT_URL: string;
    STRIPE_WEBHOOK_SECRET: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    APP_PASSWORD: string;
    EMAIL: string;

}

// Get environment variables, and assign default values if missing
const config: Config = {
    JWT_SECRET: process.env.JWT_SECRET || '11', // Provide default in case variable is missing
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
    DB_URI: process.env.DB_URI || 'mongodb://127.0.0.1:27017/sums',
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 5001, // Default port is 5000
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "sk_test_51QeKxK03Eqj3WkePdjZYYVOgXHn9PS5xi1cWPDSfF1uBfBWPXOprr49DdkleCN0sWygdx23FsfKLLAKU1i0gzJ6Z00hIbUJpw2",
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5001/payment", // Default client URL is http://localhost:3000
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "whsec_twZIGpZf0CeivN8ggUfsdUGq4YDnHTtx", // Provide default in case variable is missing
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'dzk6bdune', // Provide default in case variable is missing
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '786967547286494',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 'gqg3h4rsluYbBQ-jwT7yy1UNf8s',
    APP_PASSWORD: process.env.APP_PASSWORD || 'cyqjtcpohreqggxk',
    EMAIL: process.env.EMAIL || 'diveshdivesh1222@gmail.com',
};

// Export the config object to be used in other files
export { config };
