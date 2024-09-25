"use client";

import { LoaderButton } from "@/components/loader-button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useServerAction } from "zsa-react";
import { clearReadNotificationsAction } from "./actions";
import { useToast } from "@/components/ui/use-toast";
import { TrashIcon } from "lucide-react";
import { btnIconStyles, btnStyles } from "@/styles/icons";

export function ClearReadButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { execute, isPending } = useServerAction(clearReadNotificationsAction, {
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Mensagens lidas foram apagadas.",
      });
      setIsOpen(false);
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className={btnStyles} variant="destructive">
          <TrashIcon className={btnIconStyles} /> Limpar notificações de leitura
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Isso limpará permanentemente todas as suas notificações de leitura do
            sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <LoaderButton
            onClick={() => {
              execute();
            }}
            isLoading={isPending}
          >
            Limpar notificações
          </LoaderButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
