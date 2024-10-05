import { z } from 'zod';

export const schema = z.object({
  name: z.string().min(1, "O nome da caixa é obrigatório."),
  parentId: z.number().optional(),
  description: z.string().min(1, "A descrição é obrigatória."),
});
