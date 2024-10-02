import { database } from '@/db';
import { plants } from '@/db/schema';
import { desc, eq, isNull } from 'drizzle-orm';
import { PublicError } from '@/use-cases/errors';
import { PlantData } from '@/interfaces/PlantData';
import { uploadFileToBucket } from '@/lib/files';
import { MAX_UPLOAD_IMAGE_SIZE, MAX_UPLOAD_IMAGE_SIZE_IN_MB } from '@/app-config';
import { UserSession } from './types';
import { PlantId } from "@/db/schema";
import { createUUID } from '@/util/uuid';
import { assertPlantExists } from './authorization';
import { createPlant, updatePlant } from '@/data-access/plants';

export async function getPlantUseCase(): Promise<PlantData[]> {
  try {
    const allPlants = await database.query.plants.findMany({
      where: (fields) => isNull(fields.deletedAt), 
      orderBy: (fields) => desc(fields.createdAt), 
    });

    return allPlants;
  } catch (error) {
    console.error('Erro ao buscar dados das plantas:', error);
    return [];
  }
}

export async function createPlantUseCase(
  authenticatedUser: UserSession,
  {
    name,
    scientificName,
    description,
    history,
    plantImages, 
  }: {
    name: string;
    scientificName: string;
    description: string;
    history: string;
    plantImages?: File[];
  }
) {
  let photoNames = '';

  if (plantImages) {
    const generatedNames = plantImages.map(() => createUUID());

    photoNames = generatedNames.join(', ');
  }

  await createPlant({
    userId: authenticatedUser.id,
    name,
    scientificName,
    description,
    history,
    photoName: photoNames, 
  });

  if (plantImages && plantImages.length > 0) {
    const plant = await database.query.plants.findFirst({
      orderBy: desc(plants.id),
    });

    if (!plant) throw new Error('Erro ao encontrar a planta recém-criada.');

    for (let i = 0; i < plantImages.length; i++) {
      const plantImage = plantImages[i];
      const imageId = photoNames.split(', ')[i]; 
      await uploadFileToBucket(plantImage, `plants/${plant.id}/images/${imageId}`);
    }
  }
}

export async function updatePlantUseCase(
  authenticatedUser: UserSession,
  {
    plantId, 
    name,
    scientificName,
    description,
    history,
    plantImages,
  }: {
    plantId: number;
    name: string;
    scientificName: string;
    description: string;
    history: string;
    plantImages?: File[];
  }
) {
  const plant = await assertPlantExists(plantId);

  if (plant.userId !== authenticatedUser.id) {
    throw new Error('Usuário não autorizado a atualizar esta planta.');
  }

  let photoNames = plant.photoName || ''; 

  if (plantImages && plantImages.length > 0) {
    const generatedNames = plantImages.map(() => createUUID());

    photoNames = photoNames
      ? `${photoNames}, ${generatedNames.join(', ')}`
      : generatedNames.join(', ');
  }

  await updatePlant(plantId, {
    name,
    scientificName,
    description,
    history,
    photoName: photoNames, 
  });

  if (plantImages && plantImages.length > 0) {
    for (let i = 0; i < plantImages.length; i++) {
      const plantImage = plantImages[i];
      const imageId = photoNames.split(', ')[i]; 
      await uploadFileToBucket(plantImage, `plants/${plant.id}/images/${imageId}`);
    }
  }
}

export async function updatePlantImageUseCase(
  authenticatedUser: UserSession,
  { plantId, file }: { plantId: PlantId; file: File }
) {

  if (file.size > MAX_UPLOAD_IMAGE_SIZE) {
    throw new PublicError(
      `File size should be less than ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB.`
    );
  }

  const imageId = createUUID();

  await uploadFileToBucket(file, `plants/${plantId}/images/${imageId}`);
}


// Função para deletar uma planta
export async function deletePlantUseCase(plantId: number) {
  'use server';
  const plant = await database
    .select({ id: plants.id })
    .from(plants)
    .where(eq(plants.id, plantId))
    .limit(1);

  if (!plant.length) {
    throw new Error('Planta não encontrada.');
  }

  await database
    .update(plants)
    .set({ deletedAt: new Date() })
    .where(eq(plants.id, plantId));
}
