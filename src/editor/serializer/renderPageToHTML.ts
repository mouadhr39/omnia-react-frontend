import { PageDocument, EditorMode } from '@/editor/types/page';
import { serializeNode } from '@/editor/serializer/serializeNode';
import { escapeHTML } from '@/editor/serializer/htmlEscape';

export function renderPageToHTML(doc: PageDocument, options: { mode: EditorMode }): string {
  const headHTML = `
    ${doc.head.meta ? Object.entries(doc.head.meta).map(([k, v]) => `<meta name="${escapeHTML(k)}" content="${escapeHTML(v)}">`).join('\n') : ''}
    ${doc.head.css.map((css) => `<style data-scope="global">${escapeHTML(css)}</style>`).join('\n')}
    ${options.mode === 'preview'
      ? doc.head.js.map((js) => `<script data-scope="global">${escapeHTML(js)}</script>`).join('\n')
      : ''
    }
  `;

  const bodyHTML = doc.root.map((node) => serializeNode(node, options.mode)).join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${headHTML}
  <style>
    [data-edit-mode="true"] [data-node-id] { position: relative; }
    [data-edit-mode="true"] [data-node-id]:hover { outline: 1px solid rgba(59,130,246,0.5); }
    [data-edit-mode="true"] [data-node-id][data-selected="true"] { outline: 2px solid #3b82f6; }
  </style>
</head>
<body data-edit-mode="${options.mode === 'edit'}">
  ${bodyHTML}
  <script>
    if (window.parent !== window) {
      window.addEventListener('click', (e) => {
        const nodeId = e.target.closest('[data-node-id]')?.dataset?.nodeId;
        if (nodeId) window.parent.postMessage({ type: 'SELECT_NODE', nodeId }, '*');
      });
      window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
    }
  </script>
</body>
</html>`;
}
