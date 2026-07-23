import {
  type ComponentDefinition,
  type SerializeProps,
} from '@/editor/types/page';
import { escapeHTML } from '@/editor/serializer/htmlEscape';
import { sanitizeHTML } from '@/editor/security/sanitize';

export const CodeBlock: ComponentDefinition = {
  type: 'code_block',
  label: 'Code Block',
  icon: 'Code',
  category: 'Advanced',
  defaultProps: { html: '', css: '', js: '' },
  propsSchema: [
    { key: 'html', type: 'code', label: 'HTML', defaultValue: '' },
    { key: 'css', type: 'code', label: 'CSS', defaultValue: '' },
    { key: 'js', type: 'code', label: 'JS', defaultValue: '' },
  ],
  serialize: (props: SerializeProps) => {
    const cssBlock = props.css
      ? `<style data-scope="inline">${escapeHTML(props.css as string)}</style>`
      : '';
    const jsBlock = props.js
      ? `<script data-scope="inline">${escapeHTML(props.js as string)}</script>`
      : '';
    const htmlContent = sanitizeHTML((props.html || '') as string);
    return `
      <div class="c-code-block">
        ${cssBlock}
        ${jsBlock}
        <div class="c-code-block-content">${htmlContent}</div>
      </div>
    `;
  },
};
