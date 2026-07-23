import { type ComponentDefinition, type SerializeProps } from '@/editor/types/page';
import { escapeHTML } from '@/editor/serializer/htmlEscape';
import { sanitizeText } from '@/editor/security/sanitize';

export const Button: ComponentDefinition = {
  type: 'button',
  label: 'Button',
  icon: 'MousePointerClick',
  category: 'Content',
  defaultProps: { text: 'Button', href: '#', variant: 'primary' },
  propsSchema: [
    { key: 'text', type: 'text', label: 'Text', defaultValue: 'Button' },
    { key: 'href', type: 'text', label: 'Link', defaultValue: '#' },
    { key: 'variant', type: 'select', label: 'Variant', defaultValue: 'primary', options: [
      { label: 'Primary', value: 'primary' },
      { label: 'Secondary', value: 'secondary' },
      { label: 'Outline', value: 'outline' },
    ]},
  ],
  serialize: (props: SerializeProps) => {
    const href = sanitizeText(props.href as string);
    const variantStyle = props.variant === 'primary'
      ? 'background:#3b82f6; color:#fff; padding:8px 16px; border:none; border-radius:4px; text-decoration:none; display:inline-block;'
      : props.variant === 'outline'
      ? 'background:none; color:#3b82f6; padding:8px 16px; border:1px solid #3b82f6; border-radius:4px; text-decoration:none; display:inline-block;'
      : 'background:#6b7280; color:#fff; padding:8px 16px; border:none; border-radius:4px; text-decoration:none; display:inline-block;';
    return `<a class="c-button" href="${escapeHTML(href)}" style="${variantStyle}">${sanitizeText(props.text as string)}</a>`;
  },
};
