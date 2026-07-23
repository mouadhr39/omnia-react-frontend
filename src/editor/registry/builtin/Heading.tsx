import { type ComponentDefinition, type SerializeProps } from '@/editor/types/page';
import { escapeHTML } from '@/editor/serializer/htmlEscape';
import { sanitizeText } from '@/editor/security/sanitize';
import { EditorMode } from '@/editor/types/page';

export const Heading: ComponentDefinition = {
  type: 'heading',
  label: 'Heading',
  icon: 'Heading',
  category: 'Content',
  defaultProps: { text: 'Heading', level: 'h2' },
  propsSchema: [
    { key: 'text', type: 'text', label: 'Text', defaultValue: 'Heading', editMode: 'both' },
    { key: 'level', type: 'select', label: 'Level', defaultValue: 'h2', options: [
      { label: 'H1', value: 'h1' },
      { label: 'H2', value: 'h2' },
      { label: 'H3', value: 'h3' },
      { label: 'H4', value: 'h4' },
    ], editMode: 'dialog' },
  ],
  serialize: (props: SerializeProps, _childrenHTML?: string, mode?: EditorMode) => {
    const tag = escapeHTML(props.level as string);
    const text = sanitizeText(props.text as string);
    const editable = mode === 'edit' ? ' contenteditable="true" data-prop="text"' : '';
    return `<${tag} class="c-heading" style="margin:0; padding:0;"${editable}>${text}</${tag}>`;
  },
};
