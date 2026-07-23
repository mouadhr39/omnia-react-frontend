import { PageNode, EditorMode } from '@/editor/types/page';
import { componentRegistry } from '@/editor/registry/components';
import { escapeHTML } from '@/editor/serializer/htmlEscape';

export function serializeNode(node: PageNode, mode: EditorMode): string {
  const definition = componentRegistry.get(node.type);
  if (!definition) {
    return `<div data-node-id="${node.id}" data-missing="${node.type}">Unknown component</div>`;
  }

  const childrenHTML = node.children.map((child) => serializeNode(child, mode)).join('');
  const editAttrs = mode === 'edit' ? ` data-node-id="${node.id}" data-component-type="${node.type}"` : '';

  const designCSS = node.design.css
    ? `<style data-scope="component" data-node-id="${node.id}">${escapeHTML(node.design.css)}</style>`
    : '';
  const designJS =
    node.design.js && mode === 'preview'
      ? `<script data-scope="component" data-node-id="${node.id}">${escapeHTML(node.design.js)}</script>`
      : '';

  return `
    <div${editAttrs}>
      ${designCSS}
      ${definition.serialize({ ...node.props, children: childrenHTML }, childrenHTML)}
      ${designJS}
    </div>
  `;
}
