import { type ComponentDefinition, type SerializeProps } from '@/editor/types/page';
import { sanitizeText } from '@/editor/security/sanitize';

export const Text: ComponentDefinition = {
  type: 'text',
  label: 'Text',
  icon: 'Type',
  category: 'Content',
  defaultProps: { text: 'Text block' },
  propsSchema: [
    { key: 'text', type: 'richtext', label: 'Text', defaultValue: 'Text block' },
  ],
  serialize: (props: SerializeProps) => `
    <p class="c-text" style="margin:0; padding:0;">${sanitizeText(props.text as string)}</p>
  `,
};
