import { PageNode } from '@/editor/types';

export function findNodeParentAndIndex(
  id: string,
  root: PageNode[],
  parent: PageNode | null = null
): { parent: PageNode | null; index: number } | null {
  for (let i = 0; i < root.length; i++) {
    if (root[i].id === id) return { parent, index: i };
    const found = findNodeParentAndIndex(id, root[i].children, root[i]);
    if (found) return found;
  }
  return null;
}

export function findNode(id: string, root: PageNode[]): PageNode | null {
  for (const n of root) {
    if (n.id === id) return n;
    const found = findNode(id, n.children);
    if (found) return found;
  }
  return null;
}
