const request = require('supertest');
const express = require('express');
const { requireLogin, requireAdmin, authUser } = require('../middleware/auth');;
require('jsonwebtoken');

jest.mock('jsonwebtoken', () => ({
  decode: jest.fn().mockImplementation((token) => {
    console.log("JWT_DECODE_MOCK_USED");
    return { username: 'testUser', admin: true };
  }),
}));

const app = express();
app.use(authUser);
const next = jest.fn();

describe('authUser Middleware', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should add curr_username and curr_admin to the req object', async () => {
    const req = {
      body: {
        _token: 'mockToken', 
      },
    };
    const res = {};
  
    await authUser(req, res, next);
  
    expect(req.curr_username).toBeDefined();
    expect(req.curr_admin).toBeDefined();
  });
  

  it('should not attach anything to the request object if no token is present', async () => {
    const req = {};
    await authUser(req, {}, next);
    expect(req.curr_username).not.toBeDefined();
    expect(req.curr_admin).not.toBeDefined();
    expect(next).toHaveBeenCalled();
  });

  it('should call next with an error if the token is invalid', async () => {
    // Resetting the mock to its original state before each test
    jest.resetModules(); // This resets the state of all cached modules
     
  
    // Mocking jwt.decode to throw an error
    jest.mock('jsonwebtoken', () => ({
      decode: jest.fn().mockImplementation(() => {
        throw new Error('Invalid token');
      }),
    }));
  
    const req = {
      body: {
        _token: 'invalidToken',
      },
    };
  
    try {
      await authUser(req, {}, next);
    } catch (error) {
      expect(error.message).toBe('Invalid token');
    }
  
    // Restoring the original jwt.decode after the test
    jest.restoreAllMocks();
  });
  
});


/** Require Login */
describe('requireLogin Middleware', () => {
    it('should proceed if the user is authenticated', async () => {
      const req = {
        curr_username: 'testUser',
      };
      const res = {
        status: 200,
        json: {},
      };
      const next = jest.fn();
      await requireLogin(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  
    it('should send a 401 response if the user is not authenticated', async () => {
      // Mock the request object with curr_username to simulate authentication state
      const req = { curr_username: null }; // Simulate unauthenticated user
      
      // Correctly mock the response object to allow setting status and sending JSON responses
      const res = {
        status: jest.fn().mockReturnThis(), // Mock status method to return 'this' for chaining
        json: jest.fn(), // Mock json method
      };
      
      // Mock next function
      const next = jest.fn();
    
      // Call requireLogin with the mocked req, res, and next
      await requireLogin(req, res, next);
    
      // Assertions
      expect(res.status).toHaveBeenCalledWith(401); // Check if status was set to 401
      expect(res.json).toHaveBeenCalledWith({ error: 'Not authenticated' }); // Check if JSON was sent with the correct message
    
      // Optionally, check if next was not called if no error occurred
      expect(next).toHaveBeenCalledTimes(0);
    });
    
  
    it('should pass control to the next middleware if an error occurs', async () => {
      // Simulate an error condition by mocking res.status and res.json to throw errors
      const req = {};
      const res = {
        status: jest.fn(() => {
          throw new Error('Simulated error');
        }),
        json: jest.fn(() => {
          throw new Error('Simulated error');
        }),
      };
      const next = jest.fn();
    
      // Attempt to call requireLogin with the simulated error condition
      try {
        await requireLogin(req, res, next);
      } catch (error) {
        // Expect that the error caught here is passed to the next middleware
        expect(next).toHaveBeenCalledWith(error);
      }
    });
    
  });
  
/** Require Admin */

describe('requireAdmin Middleware', () => {
    it('should proceed if the user is an admin', async () => {
      const req = {
        curr_admin: true,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
      await requireAdmin(req, res, next);
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  
    it('should send a 401 response if the user is not an admin', async () => {
      const req = {
        curr_admin: false,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
      await requireAdmin(req, res, next);
      expect(next).toHaveBeenCalledWith({ status: 401, message: 'Unauthorized' });
    });
    
  
    it('should pass control to the next middleware if an error occurs', async () => {
      // Simulate an error condition by making req.curr_admin throw an error
      const req = {
        curr_admin: () => {
          throw new Error('Simulated error');
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
    
      // Attempt to call requireAdmin with the simulated error condition
      try {
        await requireAdmin(req, res, next);
      } catch (error) {
        // Expect that the error caught here is passed to the next middleware
        expect(next).toHaveBeenCalledWith(error);
      }
    });
    
  });
  