import { ComponentType, PageNode } from '@/editor/types';

export function getDefaultNode(type: ComponentType): PageNode {
  const defaults: Record<ComponentType, Partial<PageNode>> = {
    container: {
      props: { gap: 16, padding: 16, background: '#ffffff' },
      children: [],
    },
    stack: { props: { gap: 8 }, children: [] },
    heading: { props: { text: 'Heading', level: 'h2' }, children: [] },
    text: { props: { text: 'Text block' }, children: [] },
    image: {
      props: { src: '', alt: 'Image', width: 400, height: 300 },
      children: [],
    },
    button: {
      props: { text: 'Button', href: '#', variant: 'primary' },
      children: [],
    },
    divider: { props: { style: 'solid' }, children: [] },
    spacer: { props: { height: 40 }, children: [] },
    columns: { props: { gap: 16, columns: 2 }, children: [] },
    code_block: { props: { html: '', css: '', js: '' }, children: [] },
  };
  return {
    id: '',
    type,
    props: {},
    children: [],
    order: 0,
    parentId: null,
    design: {},
    ...defaults[type],
  } as PageNode;
}
