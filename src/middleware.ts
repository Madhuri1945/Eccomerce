import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Match all routes except for static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:html?|css|js|json|jpg|jpeg|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always apply middleware to API routes
    "/(api|trpc)(.*)",
  ],
};
