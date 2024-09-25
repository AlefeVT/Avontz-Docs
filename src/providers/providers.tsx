"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { env } from "@/env";
import { RootProvider } from "fumadocs-ui/provider";

if (typeof window !== "undefined") {
  // para produção é esse
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false,
  });

  // developer
  // posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
  //   api_host: "http://localhost:8000",
  //   capture_pageview: false,
  // });
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <RootProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <PostHogProvider client={posthog}>{children}</PostHogProvider>
      </ThemeProvider>
    </RootProvider>
  );
}
