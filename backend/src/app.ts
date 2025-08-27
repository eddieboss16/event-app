import express from "express";
import rateLimit from "express-rate-limit";
import helmet, { crossOriginEmbedderPolicy } from "helmet";


// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    },
});

app.use('/api/', limiter);

// CORS configuration
app.use(crossOriginEmbedderPolicy)