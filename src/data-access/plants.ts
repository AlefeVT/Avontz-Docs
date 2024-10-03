import { database } from "@/db";
import { NewPlant, PlantId, Plants, plants } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getPlantById(plantId: PlantId) {
    return await database.query.plants.findFirst({
      where: eq(plants.id, plantId),
    });
  }

  export async function getPlant(plantId: Plants["id"]) {
    return await database.query.plants.findFirst({
      where: eq(plants.id, plantId),
    });
  }

  export async function createPlant(plant: NewPlant) {
    await database.insert(plants).values(plant);
  }

  export async function updatePlant(plantId: Plants["id"], updatedData: Partial<Plants>) {
    await database.update(plants)
      .set(updatedData)
      .where(eq(plants.id, plantId));
  }