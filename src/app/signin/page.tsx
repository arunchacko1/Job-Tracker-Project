import { Suspense } from "react";
import { SignInForm } from "@/components/sign-in-form";

export default function SignInPage() {
  return (
    <main className="page">
      <section className="auth-panel">
        <p className="eyebrow">Demo account</p>
        <h1>Sign in</h1>
        <p className="muted">Use demo@example.com and password123 after running the seed script.</p>
        <Suspense>
          <SignInForm />
        </Suspense>
      </section>
    </main>
  );
}
