"use client";

import { trackEvent } from "@/lib/analytics";

export function KontaktFeedbackLink({
  email,
  children,
  className,
}: {
  email: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={`mailto:${email}`}
      className={className}
      onClick={() => trackEvent("feedback_submitted", { channel: "mailto" })}
    >
      {children}
    </a>
  );
}
