"use server"

import { createContainerUseCase, deleteContainerUseCase, updateContainerUseCase } from '@/use-cases/containers';
import { authenticatedAction } from '../../lib/safe-action';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const createContainerAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      name: z.string().min(1),
      parentId: z.number().optional(),
      description: z.string().min(1),
    })
  )
  .handler(
    async ({
      input: { name, parentId, description },
      ctx: { user },
    }) => {

      await createContainerUseCase(user, {
        name,
        parentId: parentId ?? null,
        description,
      });

      revalidatePath(`/dashboard`);
    }
  );

export const updateContainerAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      containerId: z.number().min(1),
      name: z.string().min(1),
      parentId: z.number().optional(),
      description: z.string().min(1),
    })
  )
  .handler(
    async ({
      input: { containerId, name, parentId, description },
      ctx: { user },
    }) => {

      await updateContainerUseCase(user, {
        containerId,
        name,
        parentId: parentId ?? null,
        description,
      });

      revalidatePath(`/dashboard`);
    }
  );



  export const deleteContainerAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      containerId: z.union([z.number(), z.array(z.number())]), 
    })
  )
  .handler(
    async ({
      input: { containerId },
      ctx: { user },
    }) => {
      const containerIds = Array.isArray(containerId) ? containerId : [containerId];

      for (const id of containerIds) {
        await deleteContainerUseCase(user, {
          containerId: id,
        });
      }

      revalidatePath('/dashboard');
    }
  );

