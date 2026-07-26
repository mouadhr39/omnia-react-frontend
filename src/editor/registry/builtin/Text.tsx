import {
  type ComponentDefinition,
  type SerializeProps,
} from '@/editor/types/page';
import { sanitizeText } from '@/editor/security/sanitize';
import { EditorMode } from '@/editor/types/page';

export const Text: ComponentDefinition = {
  type: 'text',
  label: 'Text',
  icon: 'Type',
  category: 'Content',
  defaultProps: { text: 'Text block' },
  propsSchema: [
    {
      key: 'text',
      type: 'richtext',
      label: 'Text',
      defaultValue: 'Text block',
      editMode: 'both',
    },
  ],
  serialize: (
    props: SerializeProps,
    _childrenHTML?: string,
    mode?: EditorMode
  ) => {
    const text = sanitizeText(props.text as string);
    const editable =
      mode === 'edit' ? ' contenteditable="true" data-prop="text"' : '';
    return `<p class="c-text" style="margin:0; padding:0;"${editable}>${text}</p>`;
  },
};
