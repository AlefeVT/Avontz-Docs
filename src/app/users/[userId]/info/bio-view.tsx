'use client';

import { EditorProvider } from '@tiptap/react';

export default function BioView({ bio }: { bio: string }) {
  return (
    <div className="no-scroll">
      <EditorProvider content={bio} editable={false}></EditorProvider>
    </div>
  );
}
