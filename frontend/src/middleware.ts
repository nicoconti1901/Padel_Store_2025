import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  // No podemos acceder al localStorage desde el middleware porque es código del servidor
  // En su lugar, vamos a permitir que el cliente maneje la autenticación
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
}; 