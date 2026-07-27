import { ComponentDefinition, PropertyContainer } from '@/editor/types';
import { escapeHTML } from '@/editor/serializer/htmlEscape';
import { sanitizeURL } from '@/editor/security/urlValidator';

export const Image: ComponentDefinition = {
  type: 'image',
  label: 'Image',
  icon: 'Image',
  category: 'Media',
  defaultProps: { src: '', alt: 'Image', width: 400, height: 300 },
  propsSchema: [
    {
      key: 'src',
      type: 'text',
      label: 'URL',
      defaultValue: '',
      editMode: 'dialog',
    },
    {
      key: 'alt',
      type: 'text',
      label: 'Alt text',
      defaultValue: 'Image',
      editMode: 'dialog',
    },
    {
      key: 'width',
      type: 'number',
      label: 'Width',
      defaultValue: 400,
      editMode: 'dialog',
    },
    {
      key: 'height',
      type: 'number',
      label: 'Height',
      defaultValue: 300,
      editMode: 'dialog',
    },
  ],
  serialize: (props: PropertyContainer) => `
    <img class="c-image" src="${sanitizeURL(props.src as string, true)}" alt="${escapeHTML(props.alt as string)}" width="${props.width as number}" height="${props.height as number}" style="max-width:100%; height:auto;" />
  `,
};
