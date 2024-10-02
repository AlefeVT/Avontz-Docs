import { z } from 'zod';

export const schema = z.object({
  name: z.string().min(1, "O nome da planta é obrigatório."),
  scientificName: z.string().optional(),
  description: z.string().min(1, "A descrição é obrigatória."),
  history: z.string().optional(),
});
