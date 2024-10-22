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
import { schema } from '../validation';
import { z } from 'zod';
import { useServerAction } from 'zsa-react';
import { createContainerAction } from '../actions';
import SearchableSelect from './SearchableSelect';

interface CreateContainerFormProps {
  containersOptions: { id: number; name: string; description?: string }[];
}

export function CreateContainerForm({ containersOptions }: CreateContainerFormProps) {
  const { setIsOpen } = useContext(ToggleContext);
  const { toast } = useToast();
  const [parentId, setParentId] = useState<number | undefined>(undefined);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      parentId: undefined, // Ajuste o valor padrão para undefined
      description: '',
    },
  });

  const { handleSubmit, control, setValue } = form;

  const { execute, error, isPending } = useServerAction(createContainerAction, {
    onSuccess() {
      toast({
        title: 'Success',
        description: 'Caixa criada com sucesso.',
      });
      setIsOpen(false);
    },
    onError() {
      toast({
        title: 'Erro',
        variant: 'destructive',
        description: 'Algo deu errado ao criar a caixa.',
      });
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    execute({
      name: data.name,
      parentId: parentId, // Usa o estado local para parentId
      description: data.description,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mb-10">
        {/* Campo de Nome */}
        <FormField control={control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Nome da caixa</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Digite o nome da caixa" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* SearchableSelect para Caixa Pai */}
        <SearchableSelect
          items={containersOptions.map((container) => ({
            value: container.id.toString(),
            label: container.name,
            description: container.description || undefined,
          }))}
          selectedValue={parentId !== undefined ? parentId.toString() : undefined} // Converte para string
          onValueChange={(value) => {
            const selectedValue = value ? Number(value) : undefined;
            setParentId(selectedValue); // Atualiza o estado local
            setValue('parentId', selectedValue); // Alinha com o estado do formulário
          }}
          label="Caixa Pai (Opcional)"
          placeholder="Selecione uma caixa pai..."
        />

        {/* Campo de Descrição */}
        <FormField control={control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Digite a descrição da caixa" rows={4} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Botão de Submissão */}
        <LoaderButton isLoading={isPending}>
          <CheckIcon className="h-5" /> Cadastrar Container
        </LoaderButton>
      </form>
    </Form>
  );
}
