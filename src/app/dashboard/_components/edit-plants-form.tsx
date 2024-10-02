"use client";

import { LoaderButton } from "@/components/loader-button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useContext, useState } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Check, Terminal } from "lucide-react";
import { btnIconStyles } from "@/styles/icons";
import { Textarea } from "@/components/ui/textarea";
import { Plants } from "@/db/schema";
import { useServerAction } from "zsa-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ToggleContext } from "@/components/interactive-overlay";
import {
  MAX_UPLOAD_IMAGE_SIZE,
  MAX_UPLOAD_IMAGE_SIZE_IN_MB,
} from "@/app-config";
import { updatePlantAction } from "../actions";

const editPlantSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  scientificName: z.string().optional(),
  history: z.string().optional(),
  description: z.string().min(1, "A descrição é obrigatória"),
  files: typeof window !== "undefined" ? z
    .array(
      z.instanceof(File).refine((file) => file.size < MAX_UPLOAD_IMAGE_SIZE, {
        message: `A imagem é muito grande. Deve ter menos de ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB`,
      })
    )
    .optional() : z.any().optional(), 
});


export function EditPlantForm({ plant }: { plant: Plants }) {
  const { setIsOpen: setIsOverlayOpen } = useContext(ToggleContext);
  const { toast } = useToast();
  const [photos, setPhotos] = useState<File[]>([]);

  console.log(plant);

  const { execute, error, isPending } = useServerAction(updatePlantAction, {
    onSuccess() {
      toast({
        title: "Sucesso",
        description: "Planta atualizada com sucesso.",
      });
      setIsOverlayOpen(false);
    },
    onError() {
      toast({
        title: "Erro",
        variant: "destructive",
        description: "Algo deu errado ao atualizar a planta.",
      });
    },
  });

  const form = useForm<z.infer<typeof editPlantSchema>>({
    resolver: zodResolver(editPlantSchema),
    defaultValues: {
      name: plant.name,
      scientificName: plant.scientificName || "",
      history: plant.history || "",
      description: plant.description,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof editPlantSchema>> = (values) => {
    const formData = new FormData();
    formData.append("plantId", plant.id.toString()); 
    formData.append("name", values.name);
    formData.append("scientificName", values.scientificName || "");
    formData.append("description", values.description);
    formData.append("history", values.history || "");

    photos.forEach((photo) => {
      formData.append("files", photo);
    });

    execute({
      plantId: plant.id, 
      name: values.name,
      scientificName: values.scientificName || "",
      description: values.description,
      history: values.history || "",
      fileWrapper: formData, 
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
              <FormLabel>Nome da Planta</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scientificName"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Nome Científico (Opcional)</FormLabel>
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

        <FormField
          control={form.control}
          name="history"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>História (Opcional)</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Fotos da Planta</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setPhotos(e.target.files ? Array.from(e.target.files) : [])}
            />
          </FormControl>
        </FormItem>

        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Erro ao atualizar a planta</AlertTitle>
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

