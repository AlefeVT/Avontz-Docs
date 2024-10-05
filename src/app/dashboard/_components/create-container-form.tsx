"use client";

import { LoaderButton } from '@/components/loader-button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { CheckIcon } from 'lucide-react';
import { useContext, useState } from 'react';
import { ToggleContext } from '@/components/interactive-overlay';
import { schema } from '../validation';
import { z } from 'zod';
import { useServerAction } from "zsa-react";
import { createContainerAction } from '../actions';
import SearchableSelect from './SearchableSelect';

interface CreateContainerFormProps {
  containersOptions: { id: number; name: string; description?: string }[];
}

export function CreateContainerForm({
  containersOptions,
}: CreateContainerFormProps) {
  const { setIsOpen } = useContext(ToggleContext);
  const { toast } = useToast();

  const [parentId, setParentId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      parentId: 0,
      description: '',
    },
  });

  const { handleSubmit, control } = form;

  const { execute, error, isPending } = useServerAction(createContainerAction, {
    onSuccess() {
      toast({
        title: "Success",
        description: "Caixa criada com sucesso.",
      });
      setIsOpen(false);
    },
    onError() {
      toast({
        title: "Erro",
        variant: "destructive",
        description: "Algo deu errado ao criar a caixa.",
      });
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('parentId', data.parentId ? data.parentId.toString() : '');
    formData.append('description', data.description);

    execute({
      name: data.name,
      parentId: data.parentId || 0,
      description: data.description,
    });
  };


  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mb-10">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da caixa</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o nome da caixa" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SearchableSelect
          items={containersOptions.map((container) => ({
            value: container.id.toString(),
            label: container.name,
            description: container.description || undefined,
          }))}
          selectedValue={parentId}
          onValueChange={setParentId}
          label="Caixa Pai (Opcional)"
          placeholder="Selecione uma caixa pai..."
        />

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Digite a descrição da caixa" rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoaderButton isLoading={isPending}>
          <CheckIcon className="h-5" /> Cadastrar Container
        </LoaderButton>
      </form>
    </Form>
  );
}
