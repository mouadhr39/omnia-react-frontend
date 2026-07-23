import DOMPurify from 'dompurify';

interface SanitizeAllowedTags {
  ALLOWED_TAGS?: string[];
  ALLOWED_ATTR?: string[];
  ALLOW_DATA_ATTR?: boolean;
}

export function sanitizeHTML(
  html: string,
  options?: SanitizeAllowedTags & Record<string, unknown>
): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'a',
      'abbr',
      'acronym',
      'b',
      'blockquote',
      'br',
      'code',
      'del',
      'dd',
      'dl',
      'dt',
      'em',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'i',
      'img',
      'ins',
      'li',
      'ol',
      'p',
      'pre',
      's',
      'small',
      'span',
      'strong',
      'sub',
      'sup',
      'u',
      'ul',
    ],
    ALLOWED_ATTR: [
      'href',
      'src',
      'alt',
      'title',
      'class',
      'id',
      'target',
      'rel',
      'width',
      'height',
      'style',
    ],
    ALLOW_DATA_ATTR: false,
    ...options,
  });
}

export function sanitizeText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
