import { useEffect, useRef, useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { EditorMode, PageDocument } from '@/editor/types/page';
import { renderPageToHTML } from '@/editor/serializer/renderPageToHTML';

interface IframeContainerProps {
  document: PageDocument | null;
  mode: EditorMode;
  onSelectNode: (nodeId: string | null) => void;
  activeId: string | null;
}

export function IframeContainer({ document, mode, onSelectNode, activeId }: IframeContainerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<number | null>(null);
  const { setNodeRef } = useDroppable({ id: '__root__' });

  const srcdoc = document ? renderPageToHTML(document, { mode }) : '';

  const handleLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const win = iframe.contentWindow;
      if (!win) return;
      win.addEventListener('message', (e: MessageEvent) => {
        console.log("Message: " + e.data);
        if (e.origin !== window.location.origin) return;
        const { type, nodeId } = e.data || {};
        if (type === 'SELECT_NODE') {
          onSelectNode(nodeId || null);
        }
      });
    } catch {
      // cross-origin or sandboxed iframe — ignore
    }
  }, [onSelectNode]);

  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.srcdoc = srcdoc;
      }
    }, 100);
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [srcdoc]);

  return (
    <div ref={setNodeRef} className="w-full h-full">
      <iframe
        ref={iframeRef}
        data-page-root
        data-mode={mode}
        className="w-full h-full border-0 bg-white"
        srcDoc={srcdoc}
        onLoad={handleLoad}
        sandbox="allow-scripts allow-same-origin"
        style={{ pointerEvents: activeId ? 'none' : 'auto' }}
      />
    </div>
  );
}
