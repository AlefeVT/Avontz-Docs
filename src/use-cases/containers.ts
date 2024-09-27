// use-cases/containers.ts
import { database } from '@/db';
import { containers, files } from '@/db/schema';
import { eq, isNull, sql } from 'drizzle-orm';
import { PublicError } from '@/use-cases/errors';
import { ContainerData } from '@/interfaces/ContainerData';

export async function getContainersData(): Promise<{
  allContainers: ContainerData[];
  containersWithoutParent: ContainerData[];
  containersWithoutChildren: ContainerData[] | null;
}> {
  try {
    // Todos os containers
    const allContainers = await database
      .select({
        id: containers.id,
        name: containers.name,
        description: containers.description,
        createdAt: containers.createdAt,
        filesCount: sql`COUNT(${files.id})`.as<number>(),
      })
      .from(containers)
      .leftJoin(files, eq(files.containerId, containers.id))
      .groupBy(containers.id);

    // Containers sem pai (parentId é null)
    const containersWithoutParent = await database
      .select({
        id: containers.id,
        name: containers.name,
        description: containers.description,
        createdAt: containers.createdAt,
        filesCount: sql`COUNT(${files.id})`.as<number>(),
      })
      .from(containers)
      .where(isNull(containers.parentId))
      .leftJoin(files, eq(files.containerId, containers.id))
      .groupBy(containers.id);

    // Containers sem filhos
    const containersWithoutChildren = await database
      .select({
        id: containers.id,
        name: containers.name,
        description: containers.description,
        createdAt: containers.createdAt,
        filesCount: sql`COUNT(${files.id})`.as<number>(),
      })
      .from(containers)
      .where(
        sql`${containers.id} NOT IN (SELECT DISTINCT ${containers.parentId} FROM ${containers} WHERE ${containers.parentId} IS NOT NULL)`
      )
      .leftJoin(files, eq(files.containerId, containers.id))
      .groupBy(containers.id);

    return {
      allContainers,
      containersWithoutParent,
      containersWithoutChildren,
    };
  } catch (error) {
    console.error('Erro ao buscar dados dos containers:', error);
    return {
      allContainers: [],
      containersWithoutParent: [],
      containersWithoutChildren: null,
    };
  }
}

export async function createContainerUseCase({
  name,
  description,
  parentId,
  userId,
}: {
  name: string;
  description?: string | null;
  parentId?: number | null;
  userId: number;
}) {
  const existingContainer = await database
    .select({ id: containers.id })
    .from(containers)
    .where(eq(containers.name, name))
    .limit(1);

  if (existingContainer.length > 0) {
    throw new PublicError('Já existe um container com esse nome.');
  }

  // if (!isGroupVisibleToUserUseCase(authenticatedUser, groupId)) {
  //   throw new AuthenticationError();
  // }

  const result = await database.insert(containers).values({
    name,
    description: description || null,
    parentId: parentId || null,
    userId: userId,
    createdAt: new Date(),
  });

  return result;
}

export async function updateContainerUseCase({
  id,
  name,
  description,
  parentId,
  userId,
}: {
  id: number;
  name: string;
  description?: string | null;
  parentId?: number | null;
  userId: number;
}) {
  // Verifica se o container existe
  const existingContainer = await database
    .select({ id: containers.id })
    .from(containers)
    .where(eq(containers.id, id))
    .limit(1);

  if (existingContainer.length === 0) {
    throw new Error('Container não encontrado.');
  }

  // Atualiza o container
  const result = await database
    .update(containers)
    .set({
      name,
      description: description || null,
      parentId: parentId || null,
    })
    .where(eq(containers.id, id));

  return result;
}

// Use case para deletar um container
export async function deleteContainerUseCase(containerId: number) {
  const container = await database
    .select({ id: containers.id })
    .from(containers)
    .where(eq(containers.id, containerId))
    .limit(1);

  if (!container.length) {
    throw new PublicError('Container não encontrado.');
  }

  // Deleta os arquivos associados
  await database.delete(files).where(eq(files.containerId, containerId));

  // Deleta o container
  await database.delete(containers).where(eq(containers.id, containerId));
}
