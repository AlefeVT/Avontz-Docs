'use client';

import { LoaderButton } from '@/components/loader-button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useContext, useState } from 'react';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Check, Terminal } from 'lucide-react';
import { btnIconStyles } from '@/styles/icons';
import { Textarea } from '@/components/ui/textarea';
import { useServerAction } from 'zsa-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ToggleContext } from '@/components/interactive-overlay';
import { Container } from '@/db/schema';
import { updateContainerAction } from '../actions';

const editContainerSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  parentId: z.number().optional(),
  description: z.string().min(1, 'A descrição é obrigatória'),
});

export function EditContainerForm({ container }: { container: Container }) {
  const { setIsOpen: setIsOverlayOpen } = useContext(ToggleContext);
  const { toast } = useToast();

  const { execute, error, isPending } = useServerAction(updateContainerAction, {
    onSuccess() {
      toast({
        title: 'Sucesso',
        description: 'Caixa atualizada com sucesso.',
      });
      setIsOverlayOpen(false);
    },
    onError() {
      toast({
        title: 'Erro',
        variant: 'destructive',
        description: 'Algo deu errado ao atualizar a caixa.',
      });
    },
  });

  const form = useForm<z.infer<typeof editContainerSchema>>({
    resolver: zodResolver(editContainerSchema),
    defaultValues: {
      name: container.name,
      description: container.description,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof editContainerSchema>> = (
    values
  ) => {
    const formData = new FormData();
    formData.append('containerId', container.id.toString());
    formData.append('name', values.name);
    formData.append('parentId', values.parentId);
    formData.append('description', values.description);

    execute({
      containerId: container.id,
      name: values.name,
      parentId: values.parentId,
      description: values.description,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 flex-1 px-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Nome da Caixa</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea rows={7} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Erro ao atualizar a caixa</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <LoaderButton
          onClick={() => {
            onSubmit(form.getValues());
          }}
          isLoading={isPending}
        >
          <Check className={btnIconStyles} /> Salvar atualizações
        </LoaderButton>
      </form>
    </Form>
  );
}
