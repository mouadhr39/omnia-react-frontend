import { type ComponentDefinition, type SerializeProps } from '@/editor/types/page';

export const Stack: ComponentDefinition = {
  type: 'stack',
  label: 'Stack',
  icon: 'Layers',
  category: 'Layout',
  defaultProps: { gap: 8 },
  propsSchema: [
    { key: 'gap', type: 'number', label: 'Gap (px)', defaultValue: 8, editMode: 'dialog' },
  ],
  serialize: (props: SerializeProps, childrenHTML?: string) => `
    <div class="c-stack" style="gap:${props.gap as number}px; display:flex; flex-direction:column;">
      ${childrenHTML || ''}
    </div>
  `,
};
