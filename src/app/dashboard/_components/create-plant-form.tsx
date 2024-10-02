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
import { createPlantAction } from '../actions';
import { z } from 'zod';
import { useServerAction } from "zsa-react";

export function CreatePlantsForm() {
  const { setIsOpen } = useContext(ToggleContext);
  const { toast } = useToast();

  const [photos, setPhotos] = useState<File[]>([]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      scientificName: '',
      description: '',
      history: '',
    },
  });

  const { handleSubmit, control } = form;

  const { execute, error, isPending } = useServerAction(createPlantAction, {
    onSuccess() {
      toast({
        title: "Success",
        description: "Planta criada com sucesso.",
      });
      setIsOpen(false);
    },
    onError() {
      toast({
        title: "Erro",
        variant: "destructive",
        description: "Algo deu errado ao criar a planta.",
      });
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('scientificName', data.scientificName || '');
    formData.append('description', data.description);
    formData.append('history', data.history || '');

    photos.forEach((photo) => {
      formData.append('files', photo);
    });

    execute({
      name: data.name,
      scientificName: data.scientificName || '',
      description: data.description,
      history: data.history || '',
      fileWrapper: formData,
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
              <FormLabel>Nome da planta</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o nome da planta" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="scientificName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome científico (Opcional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Digite o nome científico"
                />
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
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Descreva a planta" rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="history"
          render={({ field }) => (
            <FormItem>
              <FormLabel>História (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Adicione a história da planta"
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Fotos da planta</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setPhotos(e.target.files ? Array.from(e.target.files) : [])}
            />
          </FormControl>
        </FormItem>

        <LoaderButton isLoading={isPending}>
          <CheckIcon className="h-5" /> Cadastrar Planta
        </LoaderButton>
      </form>
    </Form>
  );
}
