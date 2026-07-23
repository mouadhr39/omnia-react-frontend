import { type ComponentDefinition, type SerializeProps } from '@/editor/types/page';

export const Spacer: ComponentDefinition = {
  type: 'spacer',
  label: 'Spacer',
  icon: 'MoreVertical',
  category: 'Layout',
  defaultProps: { height: 40 },
  propsSchema: [
    { key: 'height', type: 'number', label: 'Height (px)', defaultValue: 40 },
  ],
  serialize: (props: SerializeProps) => `
    <div class="c-spacer" style="height:${props.height as number}px;" aria-hidden="true"></div>
  `,
};
