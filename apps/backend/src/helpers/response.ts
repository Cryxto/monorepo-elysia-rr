import z from 'zod';

export async function withResponseSchema<T extends z.ZodTypeAny>(
  zodSchema: T,
  execute: () => Promise<any>,
) {
  return execute().then((res) => zodSchema.parse(res));
}
