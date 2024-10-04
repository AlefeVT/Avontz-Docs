'use client';

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
import { z } from 'zod';
import { schema } from '../validation';
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
      description: '',
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      const parsedParentId = parentId ? Number(parentId) : null;
      await createContainerAction({ ...values, parentId: parsedParentId });

      toast({
        title: 'Caixa Criada',
        description: 'A caixa foi criada com sucesso!',
      });

      setIsOpen(false);
    } catch (err: any) {
      toast({
        title: 'Erro',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 mb-10"
      >
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

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Descreva a caixa (opcional)"
                  rows={4}
                />
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

        <LoaderButton isLoading={isSubmitting}>
          <CheckIcon className="h-5" /> Cadastrar Caixa
        </LoaderButton>
      </form>
    </Form>
  );
}
