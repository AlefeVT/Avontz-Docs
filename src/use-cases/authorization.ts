import { NotFoundError } from "@/app/util";
import { getContainerById } from "@/data-access/container";


export async function assertContainerExists(containerId: number) {
  const container = await getContainerById(containerId);

  if (!container) {
    throw new NotFoundError('Caixa não encontrada!');
  }

  return container;
}
