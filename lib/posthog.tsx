'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      posthog.init('phc_PD5LJphnzIPIPmoNlAxxeiLWOYhNkKEamaH6SOtSkc6', {
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'identified_only',
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('PostHog loaded');
          }
        },
      });
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

export { posthog };
