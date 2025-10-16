import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Skip middleware if Supabase is not properly configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl || supabaseUrl.includes('placeholder') || !supabaseUrl.startsWith('https://')) {
    return NextResponse.next()
  }
  
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    // Refresh session to ensure it's up to date
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
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Return the response with updated headers
    return res
  } catch (error) {
    console.log('Supabase middleware error:', error)
    // Continue without authentication if Supabase is not available
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
