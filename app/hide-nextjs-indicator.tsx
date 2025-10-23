'use client';

import { useEffect } from 'react';

export default function HideNextJSIndicator() {
  useEffect(() => {
    // Aggressively hide Next.js dev tools indicator
    const hideIndicator = () => {
      // Find and remove any Next.js dev tool buttons
      const selectors = [
        'button[aria-label*="Next"]',
        'button[aria-label*="Dev Tools"]',
        'button:has(> svg[viewBox="0 0 180 180"])',
        '[data-nextjs-devtools]',
        '#__next-build-watcher',
        '.__next-build-watcher',
      ];

      selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
          (el as HTMLElement).remove();
        });
      });

      // Also hide any fixed position buttons at bottom left
      document.querySelectorAll('button').forEach((button) => {
        const style = window.getComputedStyle(button);
        if (
          style.position === 'fixed' &&
          (style.bottom !== 'auto' || style.left !== 'auto') &&
          parseInt(style.zIndex) > 1000000
        ) {
          button.remove();
        }
      });
    };

    // Run immediately
    hideIndicator();

    // Run periodically to catch late-loading indicators
    const interval = setInterval(hideIndicator, 500);

    // Observer to catch dynamically added indicators
    const observer = new MutationObserver(hideIndicator);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return null;
}
