const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { API_KEY } = require('../src/utils/api.config');

describe('API Key Validation', () => {
  test('API_KEY is set and matches expected value', () => {
    expect(API_KEY).toBe('aaa96136-492f-4435-8177-714d8d64cf93');
  });
  
  test('API_KEY is not empty', () => {
    expect(API_KEY).not.toBe('');
    expect(API_KEY).toBeDefined();
  });
  
  test('API_KEY has correct format (UUID)', () => {
    // Simple UUID format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    expect(API_KEY).toMatch(uuidRegex);
  });
});
