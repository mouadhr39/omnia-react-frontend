import { useEffect } from 'react';

export function IframeBridge() {
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const { type } = e.data || {};
      if (type === 'IFRAME_READY') {
        // parent can act on ready if needed
        console.log("Brigde iframe ready")
      } else if (type === 'OPEN_DIALOG') {
        const { nodeId } = e.data;
        console.log("open dialog for ", nodeId)
      } else if (type === 'SELECT_NODE') {
        const { nodeId } = e.data;
        // TODO: handle select node
        console.log("select node ", nodeId);
      } else if (type === 'UPDATE_PROPS') {
        const { nodeId, prop, value } = e.data;
        // TODO: handle update props
        console.log("update props for node", nodeId, "prop:", prop, "value:", value);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return null;
}
