import { database } from '@/db';
import { Container } from '@/db/schema';
import { desc, isNull } from 'drizzle-orm';
import { UserSession } from './types';
import { assertContainerExists } from './authorization';
import { createContainer, deleteContainer, updateContainer } from '@/data-access/container';

export async function getContainersUseCase(): Promise<Container[]> {
  try {
    const Containers = await database.query.containers.findMany({
      where: (fields) => isNull(fields.deletedAt),
      orderBy: (fields) => desc(fields.createdAt),
    });

    return Containers;
  } catch (error) {
    console.error('Erro ao buscar dados das caixas:', error);
    return [];
  }
}


export async function createContainerUseCase(
  authenticatedUser: UserSession,
  {
    name,
    parentId,
    description,
  }: {
    name: string;
    parentId: number | null;
    description: string;
  }
) {

  await createContainer({
    userId: authenticatedUser.id,
    name,
    parentId,
    description,
    deletedAt: null,
    createdAt: new Date(),
  });
}

export async function updateContainerUseCase(
  authenticatedUser: UserSession,
  {
    containerId,
    name,
    parentId,
    description,
  }: {
    containerId: number;
    name: string;
    parentId: number | null;
    description: string;
  }
) {
  const container = await assertContainerExists(containerId);

  if (container.userId !== authenticatedUser.id) {
    throw new Error('Usuário não autorizado a atualizar esta caixa.');
  }

  await updateContainer(containerId, {
    name,
    parentId,
    description,
  });
}

export async function deleteContainerUseCase(
  authenticatedUser: UserSession,
  {
    containerId,
  }: {
    containerId: number;
  }
) {

  await deleteContainer(containerId, authenticatedUser.id);
}