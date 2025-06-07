#!/bin/bash
# filepath: /workspaces/BPDADrivev1/run-tests.sh

# Print banner
echo "========================================"
echo "    BDPADrive Application Test Suite    "
echo "========================================"
echo

# Run the tests
echo "Running all tests..."
echo

# Set environment variables for testing
export NODE_ENV=test

# Run Jest with verbose output
npx jest --verbose

# Get the exit code
EXIT_CODE=$?

echo
echo "========================================"
if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ All tests completed successfully!"
else
  echo "❌ Some tests failed. Check the output above for details."
fi
echo "========================================"

# Exit with the Jest exit code
exit $EXIT_CODE
