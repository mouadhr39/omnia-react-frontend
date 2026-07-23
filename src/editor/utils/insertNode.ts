import { type PageNode } from '@/editor/types/page';

export function insertNode(
  parentId: string | null,
  node: PageNode,
  root: PageNode[],
  index?: number
): PageNode[] {
  node.parentId = parentId;
  node.order = index ?? root.length;

  if (parentId === null) {
    const newRoot = [...root];
    if (typeof index === 'number' && index >= 0 && index <= newRoot.length) {
      newRoot.splice(index, 0, node);
    } else {
      newRoot.push(node);
    }
    return newRoot.map((n, i) => ({ ...n, order: i }));
  }

  return root.map((n) => {
    if (n.id === parentId) {
      const children = [...n.children];
      if (typeof index === 'number' && index >= 0 && index <= children.length) {
        children.splice(index, 0, node);
      } else {
        children.push(node);
      }
      return {
        ...n,
        children: children.map((c, i) => ({ ...c, order: i, parentId: n.id })),
      };
    }
    return {
      ...n,
      children: insertNode(parentId, node, n.children, index),
    };
  });
}

export function removeNode(id: string, root: PageNode[]): PageNode[] {
  return root
    .filter((n) => n.id !== id)
    .map((n) => ({ ...n, children: removeNode(id, n.children) }));
}

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

export function findNodeParentAndIndex(id: string, root: PageNode[], parent: PageNode | null = null): { parent: PageNode | null; index: number } | null {
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
