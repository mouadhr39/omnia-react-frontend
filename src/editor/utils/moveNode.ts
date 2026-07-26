import { PageNode } from '@/editor/types';
import { findNode } from './findNode';
import { insertNode } from './insertNode';
import { removeNode } from './removeNode';

export function moveNode(
  id: string,
  newParentId: string | null,
  newIndex: number,
  root: PageNode[]
): PageNode[] {
  const node = findNode(id, root);
  if (!node) return root;

  const detached = removeNode(id, root);
  return insertNode(newParentId, node, detached, newIndex);
}
