const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Mock API client
jest.mock('../src/utils/api.config', () => ({
  apiClient: jest.fn().mockImplementation(({ method, url }) => {
    // Mock responses for different endpoints
    if (url.includes('/lock') && method === 'GET') {
      return Promise.resolve({ data: { locked: true, user: 'test-user' } });
    }
    if (url.includes('/lock') && method === 'POST') {
      return Promise.resolve({ data: { success: true } });
    }
    if (url.includes('/lock') && method === 'DELETE') {
      return Promise.resolve({ data: { success: true } });
    }
    return Promise.resolve({ data: null });
  })
}));

// Import the lock service
const lockService = require('../src/services/lock.service');

describe('Lock Service', () => {
  // Test getting file lock
  test('Can get file lock information', async () => {
    const fileId = 'test-file-id';
    const token = 'test-token';
    
    const lockInfo = await lockService.getFileLock(fileId, token);
    
    expect(lockInfo).toBeTruthy();
    expect(lockInfo.locked).toBe(true);
  });
  
  // Test acquiring a file lock
  test('Can acquire a file lock', async () => {
    const fileId = 'test-file-id';
    const token = 'test-token';
    const lockData = {
      userId: 'test-user-id',
      clientId: lockService.generateClientId()
    };
    
    const result = await lockService.acquireFileLock(fileId, token, lockData);
    
    expect(result).toBeTruthy();
    expect(result.success).toBe(true);
  });
  
  // Test releasing a file lock
  test('Can release a file lock', async () => {
    const fileId = 'test-file-id';
    const token = 'test-token';
    
    const result = await lockService.releaseFileLock(fileId, token);
    
    expect(result).toBeTruthy();
    expect(result.success).toBe(true);
  });
  
  // Test client ID generation
  test('Generates unique client IDs', () => {
    const id1 = lockService.generateClientId();
    const id2 = lockService.generateClientId();
    
    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1).not.toEqual(id2);
  });
});
