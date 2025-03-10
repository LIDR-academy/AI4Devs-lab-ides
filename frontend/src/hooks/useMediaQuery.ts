import { useState, useEffect } from 'react';
import { breakpoints } from '../styles/breakpoints';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export function useIsMobile() {
  return useMediaQuery(`(max-width: ${breakpoints.md})`);
}

export function useIsTablet() {
  return useMediaQuery(`(min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`);
}

export function useIsDesktop() {
  return useMediaQuery(`(min-width: ${breakpoints.lg})`);
} 