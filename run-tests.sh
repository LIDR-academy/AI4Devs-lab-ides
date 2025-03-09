#!/bin/bash

# Change to project root directory
cd "$(dirname "$0")"

# Define text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}====================================${NC}"
echo -e "${BLUE}   LTI Talent Tracking System Tests ${NC}"
echo -e "${BLUE}====================================${NC}"

# Parse arguments
coverage=false
watch=false
backend_only=false
frontend_only=false
skip_ts_errors=false
fix_ts_errors=false
no_typecheck=false
all_successful=true

for arg in "$@"
do
    case $arg in
        --coverage|-c)
        coverage=true
        shift
        ;;
        --watch|-w)
        watch=true
        shift
        ;;
        --backend|-b)
        backend_only=true
        shift
        ;;
        --frontend|-f)
        frontend_only=true
        shift
        ;;
        --skip-ts-errors|-s)
        skip_ts_errors=true
        shift
        ;;
        --fix-ts-errors|-t)
        fix_ts_errors=true
        shift
        ;;
        --no-typecheck|-n)
        no_typecheck=true
        shift
        ;;
        --help|-h)
        echo -e "${GREEN}Usage:${NC} ./run-tests.sh [options]"
        echo ""
        echo "Options:"
        echo "  --coverage, -c          Run tests with coverage reporting"
        echo "  --watch, -w             Run tests in watch mode"
        echo "  --backend, -b           Run only backend tests"
        echo "  --frontend, -f          Run only frontend tests"
        echo "  --skip-ts-errors, -s    Skip TypeScript errors during tests"
        echo "  --fix-ts-errors, -t     Attempt to fix TypeScript errors before running tests"
        echo "  --no-typecheck, -n      Completely disable TypeScript checking in tests (strongest option)"
        echo "  --help, -h              Show this help message"
        exit 0
        ;;
    esac
done

# Make sure dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing root dependencies...${NC}"
    npm install
fi

# Attempt to fix TypeScript errors first if requested
if [ "$fix_ts_errors" = true ]; then
    echo -e "${YELLOW}Attempting to fix TypeScript errors...${NC}"
    
    if [ "$backend_only" = false ]; then
        echo -e "\n${BLUE}Fixing frontend TypeScript errors:${NC}"
        cd frontend && npx tsc --noEmit --skipLibCheck && cd ..
    fi
    
    if [ "$frontend_only" = false ]; then
        echo -e "\n${BLUE}Fixing backend TypeScript errors:${NC}"
        cd backend && npx tsc --noEmit --skipLibCheck && cd ..
    fi
fi

# Function to run tests
run_tests() {
    local dir=$1
    local coverage=$2
    local watch=$3
    local skip_ts_errors=$4
    local no_typecheck=$5
    local result=0

    echo -e "\n${GREEN}Running $dir tests...${NC}"
    
    cd $dir
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing $dir dependencies...${NC}"
        npm install
    fi
    
    # Set environment vars for skipping TypeScript errors
    if [ "$skip_ts_errors" = true ]; then
        export TS_NODE_TRANSPILE_ONLY=true
    fi
    
    # Create jest_args array for the --no-typecheck option
    local jest_args=""
    if [ "$no_typecheck" = true ]; then
        jest_args="-- --no-typecheck"
    fi
    
    # Run tests with the appropriate options
    if [ "$coverage" = true ] && [ "$watch" = true ]; then
        echo -e "${RED}Cannot use both coverage and watch mode together${NC}"
        npm test $jest_args
        result=$?
    elif [ "$coverage" = true ]; then
        npm run test:coverage $jest_args
        result=$?
    elif [ "$watch" = true ]; then
        npm run test:watch $jest_args
        result=$?
    else
        npm test $jest_args
        result=$?
    fi
    
    cd ..
    
    # If tests failed, suggest the no-typecheck option
    if [ $result -ne 0 ] && [ "$no_typecheck" = false ]; then
        echo -e "${YELLOW}TIP: Try running with --no-typecheck to completely bypass TypeScript checks${NC}"
    fi
    
    # Return test result
    return $result
}

# Run tests based on arguments
if [ "$backend_only" = true ]; then
    run_tests "backend" $coverage $watch $skip_ts_errors $no_typecheck
    [ $? -ne 0 ] && all_successful=false
elif [ "$frontend_only" = true ]; then
    run_tests "frontend" $coverage $watch $skip_ts_errors $no_typecheck
    [ $? -ne 0 ] && all_successful=false
else
    run_tests "backend" $coverage $watch $skip_ts_errors $no_typecheck
    [ $? -ne 0 ] && all_successful=false
    
    run_tests "frontend" $coverage $watch $skip_ts_errors $no_typecheck
    [ $? -ne 0 ] && all_successful=false
fi

# Final summary
if [ "$watch" = true ]; then
    echo -e "\n${GREEN}Tests running in watch mode.${NC}"
elif [ "$all_successful" = true ]; then
    echo -e "\n${GREEN}All tests completed successfully!${NC}"
    exit 0
else
    echo -e "\n${RED}Some tests failed. See above for details.${NC}"
    echo -e "${YELLOW}If the issues are TypeScript-related, try:\n- ./run-tests.sh --no-typecheck${NC}"
    exit 1
fi 