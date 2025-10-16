import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Skip middleware if Supabase is not properly configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl || supabaseUrl.includes('placeholder') || !supabaseUrl.startsWith('https://')) {
    return res
  }
  
  try {
    const supabase = createMiddlewareClient({ req, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Protect dashboard routes
    if (req.nextUrl.pathname.startsWith('/dashboard') || 
        req.nextUrl.pathname.startsWith('/sites') ||
        req.nextUrl.pathname.startsWith('/notifications') ||
        req.nextUrl.pathname.startsWith('/settings')) {
      if (!session) {
        return NextResponse.redirect(new URL('/auth/login', req.url))
      }
    }

    // Redirect authenticated users away from auth pages
    if (req.nextUrl.pathname.startsWith('/auth') && session) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  } catch (error) {
    console.log('Supabase middleware error:', error)
    // Continue without authentication if Supabase is not available
  }

  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
