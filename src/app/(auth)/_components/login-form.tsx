"use client";

import Link from "next/link";
import { useActionState } from "react";
import { LuTriangleAlert } from "react-icons/lu";

import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { login } from "@/app/(auth)/_lib/auth-services";
import type { FormState } from "@/app/(auth)/_lib/auth-validations";

const initialState: FormState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="rounded-2xl border border-divider bg-paper p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-text-primary">Welcome back</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Sign in to your account to continue
      </p>

      {state.message && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-sm text-error"
        >
          <LuTriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden />
          <span>{state.message}</span>
        </div>
      )}

      <form action={formAction} className="mt-5 flex flex-col gap-4">
        <Input
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          error={state.errors?.email?.[0]}
        />
        <PasswordInput
          name="password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
          error={state.errors?.password?.[0]}
        />

        <button
          type="submit"
          disabled={pending}
          className="mt-1 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </p>

      <div className="mt-4 rounded-lg bg-action-hover px-3 py-2">
        <p className="text-xs text-text-secondary">
          Demo credentials:{" "}
          <span className="font-mono text-text-primary">
            admin@xorithm.com
          </span>{" "}
          /{" "}
          <span className="font-mono text-text-primary">Admin123!</span>
        </p>
      </div>
    </div>
  );
}
