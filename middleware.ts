import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Проверка ролей для специфичных маршрутов
    if (path.startsWith('/dashboard/tenants') && token?.role !== 'LANDLORD') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (path.startsWith('/dashboard/profile') && token?.role !== 'TENANT') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (path.startsWith('/dashboard/subscription') && token?.role !== 'LANDLORD') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (path.startsWith('/dashboard/properties') && token?.role !== 'LANDLORD') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (path.startsWith('/dashboard/offers') && token?.role !== 'TENANT') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*'],
}
