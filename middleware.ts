import { auth } from '@/auth';

export default auth((req) => {
  const pathname = req.nextUrl.pathname;

  const isPublic =
    pathname.startsWith('/login') ||
    pathname.startsWith('/reply') ||
    pathname.startsWith('/api/webhooks');

  if (isPublic) return;

  if (!req.auth) {
    const url = new URL('/login', req.nextUrl.origin);
    url.searchParams.set('next', pathname);
    return Response.redirect(url);
  }

  if (pathname.startsWith('/admin')) {
    const role = (req.auth?.user as any)?.role;
    if (role !== 'SUPER_ADMIN') {
      return Response.redirect(new URL('/dashboard', req.nextUrl.origin));
    }
  }
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
