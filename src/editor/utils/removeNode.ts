import { PageNode } from '@/editor/types';

export function removeNode(id: string, root: PageNode[]): PageNode[] {
  return root
    .filter((n) => n.id !== id)
    .map((n) => ({ ...n, children: removeNode(id, n.children) }));
}
