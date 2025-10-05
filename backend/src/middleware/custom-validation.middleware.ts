import { body, param } from 'express-validator';

// Custom validation for MongoDB ObjectId
const isValidObjectId = (value: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(value);
};

export const validateObjectId = (field: string) => {
    return body(field).custom((value) => {
        if (!isValidObjectId(value)) {
            throw new Error(`${field} must be a valid ObjectId`);
        }
        return true;
    });
};

export const validateObjectIdParam = (field: string) => {
    return param(field).custom((value) => {
        if (!isValidObjectId(value)) {
            throw new Error(`${field} must be a valid ObjectId`);
        }
        return true;
    });
};
