"use server"

import {
  createPlantUseCase,
  deletePlantUseCase,
  updatePlantImageUseCase,
  updatePlantUseCase,
} from '@/use-cases/plants';
import { authenticatedAction } from '../../lib/safe-action';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const createPlantAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      name: z.string().min(1),
      scientificName: z.string().min(1),
      description: z.string().min(1),
      history: z.string().min(1),
      fileWrapper: z.instanceof(FormData),  
    })
  )
  .handler(
    async ({
      input: { name, scientificName, description, history, fileWrapper },
      ctx: { user },
    }) => {
      const plantImages = fileWrapper.getAll("files") as File[];

      await createPlantUseCase(user, {
        name,
        scientificName,
        description,
        history,
        plantImages,  
      });

      revalidatePath(`/dashboard`);
    }
  );



// Ação para criar uma nova planta
export const uploadImagePlantAction = authenticatedAction
.createServerAction()
.input(
  z.object({
    fileId: z.number(),
    fileWrapper: z.instanceof(FormData),
  })
)
.handler(async ({ input, ctx: { user } }) => {
  const file = input.fileWrapper.get("file") as File;
  await updatePlantImageUseCase(user, { plantId: input.fileId, file });
  revalidatePath(`/dashboard`);
});



export const updatePlantAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      plantId: z.number().min(1), 
      name: z.string().min(1),
      scientificName: z.string().min(1),
      description: z.string().min(1),
      history: z.string().min(1),
      fileWrapper: z.instanceof(FormData),  
    })
  )
  .handler(
    async ({
      input: { plantId, name, scientificName, description, history, fileWrapper },
      ctx: { user },
    }) => {
      const plantImages = fileWrapper.getAll("files") as File[];

      const plant = await updatePlantUseCase(user, {
        plantId, 
        name,
        scientificName,
        description,
        history,
        plantImages, 
      });

      revalidatePath(`/dashboard`);
    }
  );



export const deletePlantAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      plantId: z.array(z.number()),
    })
  )
  .handler(async ({ input: { plantId }, ctx: { user } }) => {
    for (const id of plantId) {
      await deletePlantUseCase(id);
    }

    revalidatePath('/dashboard/plants');
  });
