import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/register';
  
  // Get token from cookies
  const token = request.cookies.get('jwt_token')?.value || '';
  
  // Redirect logic
  if (isPublicPath && token) {
    // If user is already logged in and tries to access login/register page
    return NextResponse.redirect(new URL('/diary', request.url));
  }
  
  if (!isPublicPath && !token) {
    // If user is not logged in and tries to access a protected route
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

// Apply middleware to specified routes
export const config = {
  matcher: [
    '/diary/:path*',
    '/login',
    '/register',
  ],
};