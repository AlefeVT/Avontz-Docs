import { NotFoundError } from "@/app/util";
import { getPlant } from "@/data-access/plants";


export async function assertPlantExists(plantId: number) {
  const plant = await getPlant(plantId);

  if (!plant) {
    throw new NotFoundError('Event not found');
  }

  return plant;
}
