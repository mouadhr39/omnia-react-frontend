import { type PageNode } from '@/editor/types/page';

export function cloneNode(node: PageNode): PageNode {
  return {
    ...node,
    props: { ...node.props },
    children: node.children.map(cloneNode),
    design: {
      ...node.design,
      attributes: node.design.attributes ? { ...node.design.attributes } : undefined,
    },
  };
}
