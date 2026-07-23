import { useEffect } from 'react';

export function IframeBridge() {
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const { type } = e.data || {};
      if (type === 'IFRAME_READY') {
        // parent can act on ready if needed
        console.log("Brigde iframe ready")
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return null;
}
