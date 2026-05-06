import type { Metadata } from "next";
import { getServerSession } from "next-auth";
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
            <a className="brand" href="/dashboard">
              Job Application Tracker
            </a>
            <nav className="nav" aria-label="Main navigation">
              {session?.user ? (
                <>
                  <a href="/dashboard">Dashboard</a>
                  <a href="/applications">Applications</a>
                  <a className="button" href="/applications/new">
                    Add application
                  </a>
                  <SignOutButton />
                </>
              ) : (
                <a className="button" href="/signin">
                  Sign in
                </a>
              )}
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
