"use server";

import { createContainerUseCase } from "@/use-cases/containers";
import { authenticatedAction } from "../../lib/safe-action";
import { revalidatePath } from "next/cache";
import { schema } from "./validation";

export const createContainerAction = authenticatedAction
  .createServerAction()
  .input(schema)
  .handler(async ({ input: { name, description, parentId }, ctx: { user } }) => {

    await createContainerUseCase({
      name,
      description,
      parentId: parentId,  
      userId: user.id,
    });

    revalidatePath("/dashboard");
  });
