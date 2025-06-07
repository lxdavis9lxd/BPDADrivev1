# BDPADrive API Testing

This directory contains tests for validating the API functionality of the BDPADrive application, including API key integration.

## Test Files

- **api.test.js**: Tests the basic API configuration and ensures API key is loaded correctly
- **api-key-validation.test.js**: Comprehensive validation of API key inclusion in all service requests
- **api-live.test.js**: Live tests that make actual API calls (requires network connectivity)

## API Key Configuration

The application uses the API key `aaa96136-492f-4435-8177-714d8d64cf93` stored in the `.env` file to authenticate with the API server. This key is included in the headers of all API requests as `X-API-Key`.

## Running Tests

You can run the tests using the provided `test-api.sh` script:

```bash
./test-api.sh
```

This will:
1. Check if the API key is configured correctly
2. Run the API configuration tests
3. Run the API key validation tests for all services
4. Optionally run the live API tests (requires confirmation)

## Test Categories

### API Configuration Tests
- Verify API key is loaded from environment variables
- Verify API base URL is correct
- Verify headers are constructed correctly

### API Key Validation Tests
- Verify all service functions include the API key in requests
- Test all endpoints in all services

### Live API Tests
- Test actual API calls against the remote server
- Verify authentication
- Test filesystem operations (listing, creating, updating, deleting)
- Test sharing functionality
- Test versioning functionality
- Test trash operations

## Error Handling

The tests include improved error handling to provide better debugging information when tests fail. Each test captures the full error response to help diagnose issues.

## Important Notes

- Live API tests require network connectivity
- Live API tests create actual files on the server, but attempt to clean up after themselves
- Some tests may be skipped if they depend on other tests that have failed
