const jwt = require('jsonwebtoken');
require('dotenv')

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];; // Retrieve the JWT token from the request headers
    if (!token) {
        return res.status(401).json({ message: 'Authorization token not provided' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the JWT token
      // Attach the decoded payload to the request object for future use
      req.user = decoded;
      next(); // Move to the next middleware or route handler
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Invalid authorization token' });
    }
  };

module.exports = authMiddleware;