import { useEffect, useRef, useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { usePageStore } from '@/editor/store/usePageStore';
import { useNodeStore } from '@/editor/store/useNodeStore';
import { usePropStore } from '@/editor/store/usePropStore';
import { EditorMode, Document } from '@/editor/types';
import { renderPageToHTML } from '@/editor/serializer/renderPageToHTML';

interface IframeContainerProps {
  document: Document | null;
  mode: EditorMode;
  onSelectNode: (nodeId: string | null) => void;
  activeId: string | null;
}

type ToolbarAction =
  'delete' | 'update' | 'copy' | 'paste' | 'move-up' | 'move-down';

export function IframeContainer({
  document,
  mode,
  onSelectNode,
  activeId,
}: IframeContainerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<number | null>(null);
  const { setNodeRef } = useDroppable({ id: '__root__' });

  const srcdoc = document ? renderPageToHTML(document, { mode }) : '';

  const handleToolbarAction = useCallback(
    (nodeId: string, action: ToolbarAction) => {
      const nodeStore = useNodeStore.getState();
      switch (action) {
        case 'delete':
          nodeStore.removeNode(nodeId);
          nodeStore.selectNode(null);
          break;
        case 'update':
          nodeStore.setDialogNodeId(nodeId);
          break;
        case 'copy':
          nodeStore.copyToClipboard(nodeId);
          break;
        case 'paste':
          nodeStore.pasteAfterNode(nodeId);
          break;
        case 'move-up': {
          const root = usePageStore.getState().document?.root ?? [];
          let pos: { parentId: string | null; index: number } | null = null;
          for (let i = 0; i < root.length; i++) {
            if (root[i].id === nodeId) {
              pos = { parentId: null, index: i };
              break;
            }
            for (let j = 0; j < root[i].children.length; j++) {
              if (root[i].children[j].id === nodeId) {
                pos = { parentId: root[i].id, index: j };
                break;
              }
            }
            if (pos) break;
          }
          if (pos && pos.index > 0) {
            nodeStore.moveNode(nodeId, pos.parentId, pos.index - 1);
          }
          break;
        }
        case 'move-down': {
          const rootDn = usePageStore.getState().document?.root ?? [];
          let pos2: {
            parentId: string | null;
            index: number;
            total: number;
          } | null = null;
          for (let i = 0; i < rootDn.length; i++) {
            if (rootDn[i].id === nodeId) {
              pos2 = { parentId: null, index: i, total: rootDn.length };
              break;
            }
            for (let j = 0; j < rootDn[i].children.length; j++) {
              if (rootDn[i].children[j].id === nodeId) {
                pos2 = {
                  parentId: rootDn[i].id,
                  index: j,
                  total: rootDn[i].children.length,
                };
                break;
              }
            }
            if (pos2) break;
          }
          if (pos2 && pos2.index < pos2.total - 1) {
            nodeStore.moveNode(nodeId, pos2.parentId, pos2.index + 1);
          }
          break;
        }
      }
    },
    []
  );

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const msg = e.data || {};
      console.log('EV: ', e);
      console.log('msg: ', msg);
      if (msg.type === 'SELECT_NODE') {
        onSelectNode(msg.nodeId || null);
      } else if (
        msg.type === 'OPEN_DIALOG' &&
        msg.nodeId &&
        msg.nodeId !== '__parsys__'
      ) {
        useNodeStore.getState().setDialogNodeId(msg.nodeId);
      } else if (msg.type === 'OPEN_PARSYS') {
        useNodeStore.getState().setDialogNodeId(null);
        usePageStore.getState().setMode('edit');
        useNodeStore.getState().setOpenParsys(true);
      } else if (msg.type === 'UPDATE_PROPS' && msg.nodeId && msg.prop) {
        usePropStore
          .getState()
          .updateNodeProps(msg.nodeId, { [msg.prop]: msg.value });
      } else if (msg.type === 'TOOLBAR_ACTION' && msg.nodeId && msg.action) {
        handleToolbarAction(msg.nodeId, msg.action as ToolbarAction);
      }
    };
    console.log('adding event message');
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onSelectNode, handleToolbarAction]);

  const handleLoad = useCallback(() => {
    // iframe loaded
    console.log("iframe loaded");
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.srcdoc = srcdoc;
      }
    }, 1000);
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [srcdoc]);

  return (
    <div ref={setNodeRef} className="h-full w-full">
      <iframe
        ref={iframeRef}
        data-page-root
        data-mode={mode}
        className="h-full w-full border-0 bg-white"
        srcDoc={srcdoc}
        onLoad={handleLoad}
        sandbox="allow-scripts allow-same-origin"
        style={{ pointerEvents: activeId ? 'none' : 'auto' }}
      />
    </div>
  );
}
