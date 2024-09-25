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
import { useToast } from "@/components/ui/use-toast";
import { btnIconStyles, btnStyles } from "@/styles/icons";
import { DoorOpen } from "lucide-react";
import { useState } from "react";
import { useServerAction } from "zsa-react";
import { deleteGroupAction } from "./actions";
import { useGroupIdParam } from "../utils";
import { cn } from "@/lib/utils";

export function DeleteGroupButton() {
  const groupId = useGroupIdParam();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { execute, isPending } = useServerAction(deleteGroupAction, {
    onSuccess() {
      toast({
        title: "Success",
        description: "You left this group.",
      });
    },
    onError() {
      toast({
        title: "Uh oh",
        variant: "destructive",
        description: "Something went wrong delete your group.",
      });
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} className={cn(btnStyles, "w-fit")}>
          <DoorOpen className={btnIconStyles} /> Excluir grupo
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir grupo</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza de que deseja excluir este grupo? Todos os seus membros não
            não será mais possível visualizar as informações do grupo e todos os dados serão
            removido do nosso sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoaderButton
            isLoading={isPending}
            onClick={() => {
              execute({ groupId });
            }}
          >
            Excluir grupo
          </LoaderButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
