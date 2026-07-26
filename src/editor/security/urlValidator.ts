export function sanitizeURL(url: string, allowExternal = false): string {
  const trimmed = url.trim();
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('vbscript:'))
    return '#';
  if (trimmed.startsWith('data:') && !trimmed.startsWith('data:image/'))
    return '#';
  if (
    !allowExternal &&
    !trimmed.startsWith('/') &&
    !trimmed.startsWith('#') &&
    !trimmed.startsWith('mailto:')
  ) {
    return '#';
  }
  return trimmed;
}
