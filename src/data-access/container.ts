import { database } from '@/db';
import { activityLogs, Container, ContainerId, containers, NewContainer } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getContainerById(containersId: ContainerId) {
  return await database.query.containers.findFirst({
    where: eq(containers.id, containersId),
  });
}

export async function createContainer(container: NewContainer) {
  await database.insert(containers).values(container);
}

export async function updateContainer(
  containerId: Container['id'],
  updatedData: Partial<Container>
) {
  await database
    .update(containers)
    .set(updatedData)
    .where(eq(containers.id, containerId));
}

export async function deleteContainer(
  containerId: Container['id'],
  userId: number
) {
  const currentDate = new Date();

  await database
    .update(containers)
    .set({
      deletedAt: currentDate,
    })
    .where(eq(containers.id, containerId));

  await database.insert(activityLogs).values({
    userId,
    action: 'container_deleted',
    targetId: containerId,
    targetType: 'container',
    createdAt: currentDate,
  });
}
