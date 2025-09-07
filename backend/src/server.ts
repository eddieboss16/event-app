import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { prisma } from "./config/database";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Test database connection
        await prisma.$connect();
        console.log('Database connected successfully');

        // Start server
        app.listen(PORT, () => {
            console.log(`Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await prisma.$disconnect();
    process.exit(0);
});

startServer();