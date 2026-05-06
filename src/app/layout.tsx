import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out-button";
import "./globals.css";

export const metadata: Metadata = {
  title: "Job Application Tracker",
  description: "A full-stack job application tracking app."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="topbar">
            <Link className="brand" href="/dashboard">
              Job Application Tracker
            </Link>
            <nav className="nav" aria-label="Main navigation">
              {session?.user ? (
                <>
                  <Link href="/dashboard">Dashboard</Link>
                  <Link href="/applications">Applications</Link>
                  <Link className="button" href="/applications/new">
                    Add application
                  </Link>
                  <SignOutButton />
                </>
              ) : (
                <Link className="button" href="/signin">
                  Sign in
                </Link>
              )}
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
