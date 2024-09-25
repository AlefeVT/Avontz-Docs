"use client";

import { EditorProvider } from "@tiptap/react";
import {
  MenuBar,
  extensions,
} from "../../groups/[groupId]/info/edit-group-info-form";
import { LoaderButton } from "@/components/loader-button";
import { useServerAction } from "zsa-react";
import { updateProfileBioAction } from "./actions";
import { useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

export function EditBioForm({ bio }: { bio: string }) {
  const { execute, isPending } = useServerAction(updateProfileBioAction);
  const htmlRef = useRef<string>(bio);
  const { toast } = useToast();

  return (
    <div className="w-full space-y-4">
      <EditorProvider
        onUpdate={({ editor }) => {
          htmlRef.current = editor.getHTML();
        }}
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={bio}
        editable={true}
      ></EditorProvider>

      <div className="flex justify-end">
        <LoaderButton
          onClick={() => {
            execute({ bio: htmlRef.current }).then(([, err]) => {
              if (err) {
                toast({
                  title: "Uh-oh!",
                  variant: "destructive",
                  description: "Não foi possível atualizar a sua biografia do perfil.",
                });
              } else {
                toast({
                  title: "Sucesso!",
                  description: "A biografia do seu perfil foi atualizada.",
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
