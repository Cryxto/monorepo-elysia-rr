import z from "zod";

export const CommonOkResponseSchema = z.object({
  message: z.any().optional().default("ok"),
});

export type CommonOkResponse = z.infer<typeof CommonOkResponseSchema>;
export type CommonOkInputResponse = z.input<typeof CommonOkResponseSchema>;
