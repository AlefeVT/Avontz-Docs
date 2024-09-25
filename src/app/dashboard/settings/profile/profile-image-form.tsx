"use client";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoaderButton } from "@/components/loader-button";
import { useToast } from "@/components/ui/use-toast";
import { updateProfileImageAction } from "./actions";
import {
  MAX_UPLOAD_IMAGE_SIZE,
  MAX_UPLOAD_IMAGE_SIZE_IN_MB,
} from "@/app-config";
import { useServerAction } from "zsa-react";

// Validação do arquivo, sem uso de instanceof para evitar problemas com SSR
const uploadImageSchema = z.object({
  file: z
    .custom((value) => value instanceof File && value.size < MAX_UPLOAD_IMAGE_SIZE)
    .refine((file) => file, {
      message: `Sua imagem deve ter menos de ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB.`,
    }),
});

export function ProfileImageForm() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof uploadImageSchema>>({
    resolver: zodResolver(uploadImageSchema),
    defaultValues: {},
  });

  const { execute: uploadImage, isPending } = useServerAction(
    updateProfileImageAction,
    {
      onError: ({ err }) => {
        toast({
          title: "Erro",
          description: err.message || "Falha ao atualizar a imagem de perfil.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        toast({
          title: "Imagem Atualizada",
          description: "Você atualizou sua imagem de perfil com sucesso.",
        });
        formRef.current?.reset();
      },
    }
  );

  const onSubmit: SubmitHandler<z.infer<typeof uploadImageSchema>> = (values) => {
    // Verifique se o arquivo foi realmente enviado
    if (!values.file || !(values.file instanceof File)) {
      toast({
        title: "Erro",
        description: "Arquivo inválido. Por favor, envie um arquivo válido.",
        variant: "destructive",
      });
      return;
    }
  
    const formData = new FormData();
    // Adiciona o arquivo corretamente
    formData.append("file", values.file);
  
    // Chama a função de upload com o FormData
    uploadImage({ fileWrapper: formData });
  };
  

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex gap-2"
      >
        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Imagem</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files && event.target.files[0];
                    onChange(file);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoaderButton isLoading={isPending}>Carregar</LoaderButton>
      </form>
    </Form>
  );
}
