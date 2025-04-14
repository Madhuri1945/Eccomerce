import { Button } from "@/components/ui/button";
import canAccessAdminPages from "@/permissions/general";
import { getCurrentUser } from "@/services/clerk";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";
import SideBar from "./SideBar";

export default async function ConsumerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Suspense>
        <Navbar />
      </Suspense>
      {children}
    </div>
  );
}

const isAdmin = await checkAdmin();

async function checkAdmin() {
  const user = await getCurrentUser();
  return canAccessAdminPages(user);
}
function Navbar() {
  return (
    <header className="flex h-12 shadow  z-10 bg-secondary">
      <nav className="flex gap-4 container">
        {/* Logo */}
        <Link
          className="mr-auto text-lg hover:underline flex items-center"
          href="/"
        >
          Shopify
        </Link>

        {/* Signed In Section */}
        <Suspense>
          <SignedIn>
            {isAdmin ? (
              <Link
                href="/admin"
                className="hover:bg-accent/10 flex items-center px-2"
              >
                Admin
              </Link>
            ) : (
              <div className="relative group">
                <button
                  className="hover:bg-accent/10 flex items-center px-2"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Account
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-md p-2 hidden group-hover:block group-focus-within:block">
                  <div className="size-8 self-center">
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox: {
                            width: "100%",
                            height: "100%",
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            <Link
              href="/returns"
              className="hover:bg-accent/10 flex items-center px-2"
            >
              Returns & orders
            </Link>
            <Link
              href="/cart"
              className="hover:bg-accent/10 flex items-center px-2"
            >
              Cart
            </Link>
          </SignedIn>
        </Suspense>
        {/* Signed Out Section */}
        <Suspense>
          <SignedOut>
            <Button className="self-center" asChild>
              <SignInButton>Sign In</SignInButton>
            </Button>
          </SignedOut>
        </Suspense>
      </nav>
    </header>
  );
}
