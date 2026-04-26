import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Введите имя"),
  company: z.string().optional(),
  role: z.string().optional(),
  linkedin: z.string().url("Введите корректную ссылку").optional().or(z.literal("")),
  telegram: z.string().optional(),
  source: z.string().optional(),
  niche: z.string().optional(),
  birthday: z.string().optional(),
  workAnniversary: z.string().optional(),
  painPoints: z.string().optional(),
});
