import {
  type ComponentDefinition,
  type SerializeProps,
} from '@/editor/types/page';
import { escapeHTML } from '@/editor/serializer/htmlEscape';

export const Divider: ComponentDefinition = {
  type: 'divider',
  label: 'Divider',
  icon: 'Minus',
  category: 'Content',
  defaultProps: { style: 'solid' },
  propsSchema: [
    {
      key: 'style',
      type: 'select',
      label: 'Style',
      defaultValue: 'solid',
      options: [
        { label: 'Solid', value: 'solid' },
        { label: 'Dashed', value: 'dashed' },
        { label: 'Dotted', value: 'dotted' },
      ],
      editMode: 'dialog',
    },
  ],
  serialize: (props: SerializeProps) => `
    <hr class="c-divider" style="border:none; border-top:1px ${escapeHTML(props.style as string)} #e5e7eb; margin:16px 0;" />
  `,
};
