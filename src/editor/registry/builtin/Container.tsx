import { type ComponentDefinition, type SerializeProps } from '@/editor/types/page';
import { escapeHTML } from '@/editor/serializer/htmlEscape';

export const Container: ComponentDefinition = {
  type: 'container',
  label: 'Container',
  icon: 'Box',
  category: 'Layout',
  defaultProps: { gap: 16, padding: 16, background: '#ffffff' },
  propsSchema: [
    { key: 'gap', type: 'number', label: 'Gap (px)', defaultValue: 16 },
    { key: 'padding', type: 'number', label: 'Padding (px)', defaultValue: 16 },
    { key: 'background', type: 'color', label: 'Background', defaultValue: '#ffffff' },
  ],
  serialize: (props: SerializeProps, childrenHTML?: string) => `
    <div class="c-container" style="gap:${props.gap as number}px; padding:${props.padding as number}px; background:${escapeHTML(props.background as string)}; display:flex; flex-direction:column;">
      ${childrenHTML || ''}
    </div>
  `,
};
