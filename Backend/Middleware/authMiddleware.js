import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import User from '../Models/User.js';

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Extract token without "Bearer" prefix if it exists
        const tokenValue = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
        
        const decoded = jwt.verify(tokenValue, JWT_SECRET);
        
        // Get user from database (excluding password)
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        console.error("Error in authenticateToken middleware:", error);
        res.status(403).json({ message: 'Forbidden' });
    }
};

// Middleware to restrict access based on roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, no user found' });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `User role ${req.user.role} is not authorized to access this route` 
            });
        }
        
        next();
    };
};

export default authenticateToken;