import { Document } from '@/editor/types';
import { cloneNode } from '@/editor/utils/cloneNode';

export function cloneDocument(document: Document): Document {
  return {
    ...document,
    root: document.root.map((node) => cloneNode(node)),
    head: {
      ...document.head,
      css: [...document.head.css],
      js: [...document.head.js],
      meta: { ...document.head.meta },
    },
  };
}
