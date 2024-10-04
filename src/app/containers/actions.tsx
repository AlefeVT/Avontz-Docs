'use server';

import {
  createContainerUseCase,
  deleteContainerUseCase,
  updateContainerUseCase,
} from '@/use-cases/containers';
import { authenticatedAction } from '../../lib/safe-action';
import { revalidatePath } from 'next/cache';
import { schema } from './validation';
import { z } from 'zod';

export const createContainerAction = authenticatedAction
  .createServerAction()
  .input(schema)
  .handler(
    async ({ input: { name, description, parentId }, ctx: { user } }) => {
      await createContainerUseCase({
        name,
        description,
        parentId: parentId,
        userId: user.id,
      });

      revalidatePath('/dashboard');
    }
  );

export const updateContainerAction = authenticatedAction
  .createServerAction()
  .input(
    schema.extend({
      id: z.number(),
    })
  )
  .handler(
    async ({ input: { id, name, description, parentId }, ctx: { user } }) => {
      await updateContainerUseCase({
        id,
        name,
        description,
        parentId: parentId,
        userId: user.id,
      });

      revalidatePath('/dashboard');
    }
  );

export const deleteContainerAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      ids: z.array(z.number()),
    })
  )
  .handler(async ({ input: { ids }, ctx: { user } }) => {
    for (const id of ids) {
      await deleteContainerUseCase(id);
    }

    revalidatePath('/dashboard');
  });
