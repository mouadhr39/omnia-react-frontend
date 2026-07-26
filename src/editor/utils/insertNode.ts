import { PageNode } from '@/editor/types';

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


