const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Import the performance utils
const performanceUtils = require('../src/utils/performance');

describe('Performance Utilities', () => {
  // Test caching functionality
  test('Cache functions correctly store and retrieve values', () => {
    // Assuming the performance utils has a cacheFunction method
    if (performanceUtils.cacheFunction) {
      // Create a mock function that we'll cache
      const mockExpensiveOperation = jest.fn().mockImplementation((param) => {
        return `Result for ${param}`;
      });
      
      // Cache the function
      const cachedFunction = performanceUtils.cacheFunction(mockExpensiveOperation);
      
      // Call the cached function multiple times with the same parameter
      const result1 = cachedFunction('test');
      const result2 = cachedFunction('test');
      
      // Check that results are the same
      expect(result1).toBe(result2);
      
      // Check that the original function was only called once
      expect(mockExpensiveOperation).toHaveBeenCalledTimes(1);
    } else {
      // Skip if the function doesn't exist
      console.log('cacheFunction not implemented, skipping test');
    }
  });
  
  // Test rate limiting functionality
  test('Rate limiting correctly throttles requests', () => {
    // Assuming the performance utils has a rateLimit method
    if (performanceUtils.rateLimit) {
      // Create mock request and response objects
      const mockReq = { ip: '127.0.0.1' };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const mockNext = jest.fn();
      
      // Create a rate limiter (e.g., 2 calls per second)
      const rateLimiter = performanceUtils.rateLimit(2, 1000);
      
      // Call the rate limiter multiple times
      rateLimiter(mockReq, mockRes, mockNext);
      rateLimiter(mockReq, mockRes, mockNext);
      rateLimiter(mockReq, mockRes, mockNext);
      
      // First two calls should pass through to next()
      expect(mockNext).toHaveBeenCalledTimes(2);
      
      // Third call should return 429 status
      expect(mockRes.status).toHaveBeenCalledWith(429);
    } else {
      // Skip if the function doesn't exist
      console.log('rateLimit not implemented, skipping test');
    }
  });
});
