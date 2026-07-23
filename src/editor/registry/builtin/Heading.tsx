import { type ComponentDefinition, type SerializeProps } from '@/editor/types/page';
import { escapeHTML } from '@/editor/serializer/htmlEscape';
import { sanitizeText } from '@/editor/security/sanitize';

export const Heading: ComponentDefinition = {
  type: 'heading',
  label: 'Heading',
  icon: 'Heading',
  category: 'Content',
  defaultProps: { text: 'Heading', level: 'h2' },
  propsSchema: [
    { key: 'text', type: 'text', label: 'Text', defaultValue: 'Heading' },
    { key: 'level', type: 'select', label: 'Level', defaultValue: 'h2', options: [
      { label: 'H1', value: 'h1' },
      { label: 'H2', value: 'h2' },
      { label: 'H3', value: 'h3' },
      { label: 'H4', value: 'h4' },
    ]},
  ],
  serialize: (props: SerializeProps) => `
    <${escapeHTML(props.level as string)} class="c-heading" style="margin:0; padding:0;">${sanitizeText(props.text as string)}</${escapeHTML(props.level as string)}>
  `,
};
