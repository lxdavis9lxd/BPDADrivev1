#!/bin/bash
# filepath: /workspaces/BPDADrivev1/test-api.sh

# Print banner
echo "========================================"
echo "     BDPADrive API Test Suite          "
echo "========================================"
echo

# Check if API_KEY is set in .env file
if [ ! -f .env ]; then
  echo "❌ Error: .env file not found!"
  echo "Please create a .env file with API_KEY=your-api-key"
  exit 1
fi

# Extract API key from .env file
API_KEY=$(grep -o 'API_KEY=.*' .env | cut -d '=' -f 2)
if [ -z "$API_KEY" ]; then
  echo "❌ Error: API_KEY not found in .env file!"
  echo "Please add API_KEY=your-api-key to your .env file"
  exit 1
fi

# Show a masked version of the API key
MASKED_KEY="${API_KEY:0:8}...${API_KEY: -4}"
echo "Using API Key: $MASKED_KEY"
echo

# Run the API configuration tests
echo "Running API configuration tests..."
npx jest tests/api.test.js --verbose

echo
echo "Running API key validation tests..."
npx jest tests/api-key-validation.test.js --verbose

echo
echo "Running simplified API tests..."
npx jest tests/api-simple.test.js --verbose

echo
echo "========================================"
echo "Do you want to run the complete live API tests that will make actual API calls? (y/n)"
read -r response

if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
  echo
  echo "Running live API tests..."
  npx jest tests/api-live.test.js --verbose

  # Get the exit code
  EXIT_CODE=$?

  echo
  echo "========================================"
  if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Live API tests completed successfully!"
  else
    echo "❌ Some live API tests failed. Check the output above for details."
  fi
  echo "========================================"
else
  echo
  echo "Skipping live API tests. You can run them later with:"
  echo "npx jest tests/api-live.test.js"
  echo "========================================"
fi

# Exit with the Jest exit code
exit $EXIT_CODE
