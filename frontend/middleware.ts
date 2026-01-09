import { NextRequest, NextResponse } from 'next/server';

// Protect certain routes
export function middleware(request: NextRequest) {
  // Get the token from cookies or headers
  const token = request.cookies.get('jwt_token')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '');

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/settings'];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // If trying to access a protected route without a valid token
  if (isProtectedRoute && !token) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Specify which paths the middleware should run for
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};