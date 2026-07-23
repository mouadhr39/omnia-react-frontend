import Base from '@/layouts/Base';
import { WebEditorLayout } from '@/editor/layout/WebEditorLayout';

export function WebEditorRoute() {
  return (
    <Base className="h-screen">
      <WebEditorLayout />
    </Base>
  );
}
