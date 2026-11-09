"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const primary =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-[#12141a] transition-colors duration-200 hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080d]";

const quiet =
  "inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-medium text-zinc-300 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40";

export function GetStarted({ className = "", children = "Get started", signedInLabel = "Open workspace" }) {
  const { isLoaded, isSignedIn } = useUser();
  const classes = cn(primary, className);

  if (!isLoaded) {
    return (
      <span aria-hidden="true" className={`${classes} pointer-events-none bg-white/10 text-transparent`}>
        {children}
      </span>
    );
  }

  if (isSignedIn) {
    return (
      <Link href="/dashboard" className={classes}>
        {signedInLabel}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    );
  }

  return (
    <SignUpButton>
      <button type="button" className={classes}>
        {children}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </button>
    </SignUpButton>
  );
}

export function SignIn({ className = "" }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded || isSignedIn) return null;

  return (
    <SignInButton>
      <button type="button" className={cn(quiet, className)}>
        Sign in
      </button>
    </SignInButton>
  );
}
