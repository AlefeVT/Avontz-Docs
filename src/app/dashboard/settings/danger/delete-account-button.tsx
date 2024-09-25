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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { deleteAccountAction } from "./actions";
import { useServerAction } from "zsa-react";

export const deleteSchema = z.object({
  confirm: z.string().refine((v) => v === "Por favor, delete", {
    message: "Por favor, digite 'Por favor, delete' para confirmar",
  }),
});

export function DeleteAccountButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof deleteSchema>>({
    resolver: zodResolver(deleteSchema),
    defaultValues: {
      confirm: "",
    },
  });

  const { execute: deleteAccount, isPending } = useServerAction(
    deleteAccountAction,
    {
      onSuccess: () => {
        setIsOpen(false);
        toast({
          title: "Conta Excluída",
          description: "Sua conta foi excluída com sucesso.",
        });
      },
      onError: ({ err }) => {
        toast({
          title: "Erro",
          description: err.message || "Falha ao excluir a conta.",
          variant: "destructive",
        });
      },
    }
  );

  function onSubmit() {
    deleteAccount();
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-fit" variant="destructive">
          Excluir Conta
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Excluir sua conta significa que você não poderá recuperar seus dados
            no futuro. Por favor, digite <strong>Por favor, delete</strong> para
            confirmar.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <LoaderButton isLoading={isPending} variant="destructive">
                Excluir
              </LoaderButton>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
