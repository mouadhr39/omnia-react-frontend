import { type ComponentDefinition, type SerializeProps } from '@/editor/types/page';

export const Columns: ComponentDefinition = {
  type: 'columns',
  label: 'Columns',
  icon: 'Columns',
  category: 'Layout',
  defaultProps: { gap: 16, columns: 2 },
  propsSchema: [
    { key: 'gap', type: 'number', label: 'Gap (px)', defaultValue: 16, editMode: 'dialog' },
    { key: 'columns', type: 'number', label: 'Columns', defaultValue: 2, editMode: 'dialog' },
  ],
  serialize: (props: SerializeProps, childrenHTML?: string) => `
    <div class="c-columns" style="display:grid; grid-template-columns:repeat(${props.columns as number}, 1fr); gap:${props.gap as number}px;">
      ${childrenHTML || ''}
    </div>
  `,
};
