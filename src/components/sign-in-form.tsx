"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("That email and password did not match.");
      return;
    }

    router.push(searchParams.get("callbackUrl") ?? "/dashboard");
    router.refresh();
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Email
        <input name="email" type="email" defaultValue="demo@example.com" required />
      </label>
      <label>
        Password
        <input name="password" type="password" defaultValue="password123" required />
      </label>
      {error ? <p className="muted">{error}</p> : null}
      <button className="button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
