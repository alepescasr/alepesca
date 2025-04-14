import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Configurar headers de seguridad
  response.headers.set(
    'Content-Security-Policy',
    `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https: blob:;
      connect-src 'self' https://admin.alepescasr.com ws://localhost:* ws://127.0.0.1:*;
      
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      block-all-mixed-content;
    `.replace(/\s+/g, ' ').trim()
  )

  return response
}

export const config = {
  matcher: '/:path*',
} 