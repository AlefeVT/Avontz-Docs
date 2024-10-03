'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit'; // Importando o StarterKit
import { LoaderButton } from '@/components/loader-button';
import { useServerAction } from 'zsa-react';
import { updateProfileBioAction } from './actions';
import { useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';

export function EditBioForm({ bio }: { bio: string }) {
  const { execute, isPending } = useServerAction(updateProfileBioAction);
  const htmlRef = useRef<string>(bio);
  const { toast } = useToast();

  // Inicializando o editor com o StarterKit
  const editor = useEditor({
    extensions: [StarterKit],
    content: bio, // Definindo o conteúdo inicial com o bio recebido como prop
    onUpdate: ({ editor }) => {
      htmlRef.current = editor.getHTML(); // Atualizando o valor de bio com o conteúdo editado
    },
    editable: true, // Habilitando edição
  });

  return (
    <div className="w-full space-y-4">
      {/* Editor Content renderiza a área de edição */}
      <EditorContent editor={editor} />

      <div className="flex justify-end">
        <LoaderButton
          onClick={() => {
            execute({ bio: htmlRef.current }).then(([, err]) => {
              if (err) {
                toast({
                  title: 'Uh-oh!',
                  variant: 'destructive',
                  description:
                    'Não foi possível atualizar a sua biografia do perfil.',
                });
              } else {
                toast({
                  title: 'Sucesso!',
                  description: 'A biografia do seu perfil foi atualizada.',
                });
              }
            });
          }}
          isLoading={isPending}
          className="self-end"
        >
          Salvar alterações
        </LoaderButton>
      </div>
    </div>
  );
}
