const bcrypt = require('bcrypt');
const db = require('../db');
const User = require('../models/user'); 
const { BCRYPT_WORK_FACTOR } = require("../config");
const ExpressError = require('../helpers/expressError');

jest.mock('../db'); 

describe('User Model Tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('register', () => {
    it('registers a new user successfully', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });
    
        db.query.mockResolvedValueOnce({
          rows: [
            { username: 'testUser', password: 'hashedPassword', first_name: 'Test', last_name: 'User', email: 'test@example.com', phone: '1234567890' },
          ],
        });

        const newUser = await User.register({
          username: 'testUser',
          password: 'password',
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          phone: '1234567890',
        });
    
        expect(db.query).toHaveBeenCalledTimes(2);
        expect(newUser).toHaveProperty('username', 'testUser');
      });

    it('throws an error if username already exists', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ username: 'existingUser' }],
      });

      await expect(User.register({
        username: 'existingUser',
        password: 'password',
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        phone: '1234567890',
      })).rejects.toThrow('There already exists a user with username \'existingUser\'');
    });
  });

  describe('authenticate', () => {
    let compareFn;

    beforeEach(() => {
        compareFn = jest.fn().mockReturnValue(true);
        bcrypt.compare = compareFn;
    });

    afterEach(() => {
        bcrypt.compare = compareFn;
    })

    it('returns user data if authentication is successful', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ username: 'testUser', password: 'hashedPassword', first_name: 'Test', last_name: 'User', email: 'test@example.com', phone: '1234567890', admin: false }],
      });

  
      const user = await User.authenticate('testUser', 'password');
  
      expect(user).toHaveProperty('username', 'testUser');
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  
    it('throws an error if authentication fails', async () => {
      db.query.mockResolvedValueOnce({
        rows: [],
      });
  
      await expect(User.authenticate('testUser', 'wrongPassword')).rejects.toThrow('Cannot authenticate');
    });
  });
  
  describe('getAll', () => {
    it('returns all users', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ username: 'testUser', first_name: 'Test', last_name: 'User', email: 'test@example.com', phone: '1234567890' }],
      });
  
      const users = await User.getAll(null, null);
  
      expect(users).toHaveLength(1);
      expect(users[0]).toHaveProperty('username', 'testUser');
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('get', () => {
    it('returns user data if user exists', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ username: 'testUser', first_name: 'Test', last_name: 'User', email: 'test@example.com', phone: '1234567890' }],
      });
  
      const user = await User.get('testUser');
  
      expect(user).toHaveProperty('username', 'testUser');
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  
    it('throws an ExpressError if user does not exist', async () => {
        // Mock the database query to return an empty array, simulating a nonexistent user
        db.query.mockResolvedValueOnce({ rows: [] });
      
        // Await the promise and expect it to be rejected with an ExpressError
        await expect(User.get('nonexistentUser')).rejects.toBeInstanceOf(ExpressError);
      });
      
  });
  
  describe('update', () => {
    it('updates user data and returns the updated user', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ username: 'testUser', first_name: 'UpdatedName', last_name: 'UpdatedLast', email: 'updated@example.com', phone: '0987654321' }],
      });
  
      const updatedUser = await User.update('testUser', { first_name: 'UpdatedName', last_name: 'UpdatedLast', email: 'updated@example.com', phone: '0987654321' });
  
      expect(updatedUser).toHaveProperty('username', 'testUser');
      expect(updatedUser.first_name).toBe('UpdatedName');
      expect(updatedUser.last_name).toBe('UpdatedLast');
      expect(updatedUser.email).toBe('updated@example.com');
      expect(updatedUser.phone).toBe('0987654321');
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  
    it('throws an error if user does not exist', async () => {
      db.query.mockResolvedValueOnce({
        rows: [],
      });
  
      await expect(User.update('nonexistentUser', {})).rejects.toThrow('No such user');
    });
  });
  
  describe('delete', () => {
    it('deletes user and returns true', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ username: 'testUser' }],
      });
  
      const result = await User.delete('testUser');
  
      expect(result).toBe(true);
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  
    it('throws an error if user does not exist', async () => {
      db.query.mockResolvedValueOnce({
        rows: [],
      });
  
      await expect(User.delete('nonexistentUser')).rejects.toThrow('No such user');
    });
  });  
});
