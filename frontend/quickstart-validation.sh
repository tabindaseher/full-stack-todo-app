#!/bin/bash

# Quickstart validation script for the Todo Application frontend

echo "Starting quickstart validation for the Todo Application frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
MIN_NODE_VERSION="18.0.0"

if [[ $(printf '%s\n' "$MIN_NODE_VERSION" "$NODE_VERSION" | sort -V | head -n1) != "$MIN_NODE_VERSION" ]]; then
    echo "❌ Node.js version is too low. Required: $MIN_NODE_VERSION, Found: $NODE_VERSION"
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm is installed"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in the current directory."
    exit 1
fi

echo "✅ package.json found"

# Install dependencies
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies."
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check if required files exist
required_files=(
    "app/layout.tsx"
    "app/page.tsx"
    "app/dashboard/page.tsx"
    "app/login/page.tsx"
    "app/register/page.tsx"
    "components/ui/Button.tsx"
    "components/ui/Input.tsx"
    "components/TodoItem.tsx"
    "components/TodoForm.tsx"
    "components/TodoList.tsx"
    "lib/api.ts"
    "types/todo.ts"
    "types/user.ts"
    "hooks/useTodos.ts"
    "contexts/AuthContext.tsx"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo "❌ Missing required files:"
    printf '%s\n' "${missing_files[@]}"
    exit 1
fi

echo "✅ All required files exist"

# Run build to validate the application can be built
echo "Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build the application."
    exit 1
fi

echo "✅ Application built successfully"

# Validate environment configuration
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local file not found. This is optional but recommended for API configuration."
else
    echo "✅ Environment configuration found"
fi

echo ""
echo "🎉 Quickstart validation completed successfully!"
echo ""
echo "The Todo Application frontend has been validated and is ready for development."
echo ""
echo "To start the development server, run:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "The application will be available at http://localhost:3000"