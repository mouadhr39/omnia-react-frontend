import { PageDocument, EditorMode } from '@/editor/types/page';
import { serializeNode } from '@/editor/serializer/serializeNode';
import { escapeHTML } from '@/editor/serializer/htmlEscape';

export function renderPageToHTML(
  doc: PageDocument,
  options: { mode: EditorMode }
): string {
  const headHTML = `
    ${
      doc.head.meta
        ? Object.entries(doc.head.meta)
            .map(
              ([k, v]) =>
                `<meta name="${escapeHTML(k)}" content="${escapeHTML(v)}">`
            )
            .join('\n')
        : ''
    }
    ${doc.head.css.map((css) => `<style data-scope="global">${escapeHTML(css)}</style>`).join('\n')}
    ${
      options.mode === 'preview'
        ? doc.head.js
            .map(
              (js) => `<script data-scope="global">${escapeHTML(js)}</script>`
            )
            .join('\n')
        : ''
    }
  `;

  const bodyHTML = doc.root
    .map((node) => serializeNode(node, options.mode))
    .join('');

  const isEdit = options.mode === 'edit';

  const parsysHTML = isEdit ? `
    <div data-node-id="__parsys__" data-component-type="__parsys__"
         style="min-height:24px; padding: 8px 16px; margin: 12px; cursor:pointer; transition: background 0.2s; display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size: 13px; background: #f8fafc; border-radius: 4px;"
         onmouseover="this.style.background='#e2e8f0'; this.style.color='#3b82f6'"
         onmouseout="this.style.background='#f8fafc'; this.style.color='#94a3b8'"
         ondblclick="if(window.parent){window.parent.postMessage({type:'OPEN_PARSYS'},'*');}"
    >
      <span>double-click to add components</span>
    </div>
  ` : '';

  const toolbarCSS = isEdit ? `
    <style>
      #parsys-toolbar {
        position: fixed;
        z-index: 99999;
        display: none;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 4px;
        gap: 2px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        flex-direction: row;
        align-items: center;
      }
      #parsys-toolbar.visible {
        display: flex;
      }
      #parsys-toolbar button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: none;
        border-radius: 6px;
        background: transparent;
        color: #475569;
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
        flex-shrink: 0;
      }
      #parsys-toolbar button:hover {
        background: #f1f5f9;
        color: #0f172a;
      }
      #parsys-toolbar button.danger:hover {
        background: #fef2f2;
        color: #dc2626;
      }
      #parsys-toolbar .divider {
        width: 1px;
        height: 20px;
        background: #e2e8f0;
        margin: 0 3px;
        flex-shrink: 0;
      }
    </style>
    <div id="parsys-toolbar">
      <button data-action="move-up" title="Move Up">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
      </button>
      <button data-action="move-down" title="Move Down">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div class="divider"></div>
      <button data-action="copy" title="Copy">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      </button>
      <button data-action="paste" title="Paste">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/></svg>
      </button>
      <div class="divider"></div>
      <button data-action="update" title="Update">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
      </button>
      <button data-action="delete" class="danger" title="Delete">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
      </button>
    </div>
  ` : '';

  const toolbarJS = isEdit ? `
    <script>
      (function() {
        const toolbar = document.getElementById('parsys-toolbar');
        if (!toolbar) return;
        let selectedEl = null;

        function positionToolbar(el) {
          if (!el || !toolbar) return;
          const rect = el.getBoundingClientRect();
          let top = rect.top - (toolbar.offsetHeight || 36) - 6;
          if (top < 0) top = rect.bottom + 6;
          let left = rect.left + (rect.width / 2) - (toolbar.offsetWidth / 2);
          left = Math.max(4, left);
          toolbar.style.top = top + 'px';
          toolbar.style.left = left + 'px';
        }

        function showToolbar(el) {
          selectedEl = el;
          positionToolbar(el);
          toolbar.classList.add('visible');
        }

        function hideToolbar() {
          toolbar.classList.remove('visible');
          selectedEl = null;
        }

        document.addEventListener('click', function(e) {
          const nodeEl = e.target.closest('[data-node-id]');
          if (nodeEl) {
            const nid = nodeEl.getAttribute('data-node-id');
            if (nid === '__parsys__') return;
            showToolbar(nodeEl);
          } else if (!e.target.closest('#parsys-toolbar')) {
            hideToolbar();
          }
        });

        toolbar.addEventListener('click', function(e) {
          const btn = e.target.closest('button');
          if (!btn) return;
          const action = btn.getAttribute('data-action');
          if (!action) return;
          e.preventDefault();
          e.stopPropagation();
          if (selectedEl) {
            const nodeId = selectedEl.getAttribute('data-node-id');
            if (nodeId) {
              window.parent.postMessage({ type: 'TOOLBAR_ACTION', action: action, nodeId: nodeId }, '*');
            }
          }
        });
      })();
    </script>
  ` : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${headHTML}
  <style>
    [data-edit-mode="true"] [data-node-id] { position: relative; }
    [data-edit-mode="true"] [data-node-id]:hover { outline: 4px solid rgba(59,130,246,0.5); }
    [data-edit-mode="true"] [data-node-id][data-selected="true"] { outline: 4px solid #3b82f6; }
  </style>
  ${isEdit ? toolbarCSS : ''}
   <script src="https://code.jquery.com/jquery-4.0.0.js" integrity="sha256-9fsHeVnKBvqh3FB2HYu7g2xseAZ5MlN6Kz/qnkASV8U=" crossorigin="anonymous"></script>
</head>
<body data-edit-mode="${isEdit}">
  ${bodyHTML}
  ${parsysHTML}
  ${toolbarJS}
<script>
  $(document).ready(function() {
    if (window.parent !== window) {
      let clickTimer = null;

      $(window).on('click', function(e) {
        const $nodeEl = $(e.target).closest('[data-node-id]');
        if (!$nodeEl.length) return;

        if (clickTimer) {
          window.clearTimeout(clickTimer);
          clickTimer = null;
          
          const nodeId = $nodeEl.data('node-id');
          if (nodeId && nodeId !== '__parsys__') {
            window.parent.postMessage({ type: 'OPEN_DIALOG', nodeId: String(nodeId) }, '*');
          }
        } else {
          clickTimer = window.setTimeout(function() {
            clickTimer = null;
            
            const nodeId = $nodeEl.data('node-id');
            if (nodeId && nodeId !== '__parsys__') {
              window.parent.postMessage({ type: 'SELECT_NODE', nodeId: String(nodeId) }, '*');
            }
          }, 250);
        }
      });

      $(window).on('focusout', function(e) {
        const $target = $(e.target);
        
        if ($target.is('[contenteditable]')) {
          const $nodeEl = $target.closest('[data-node-id]');
          if (!$nodeEl.length) return;

          const nodeId = $nodeEl.data('node-id');
          const prop = $target.data('prop');

          if (nodeId && prop) {
            window.parent.postMessage({
              type: 'UPDATE_PROPS',
              nodeId: String(nodeId),
              prop: String(prop),
              value: $target.text()
            }, '*');
          }
        }
      });
    }
  });
</script>

</body>
</html>`;
}
