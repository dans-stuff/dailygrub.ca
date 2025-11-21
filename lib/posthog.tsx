'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize PostHog only if API key is provided
      const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

      if (apiKey) {
        posthog.init(apiKey, {
          api_host: host,
          person_profiles: 'identified_only',
          loaded: (posthog) => {
            if (process.env.NODE_ENV === 'development') {
              console.log('PostHog loaded');
            }
          },
        });
      } else if (process.env.NODE_ENV === 'development') {
        console.warn('PostHog API key not found. Set NEXT_PUBLIC_POSTHOG_KEY in .env.local');
      }
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

export { posthog };
