import z from "zod";

export const CommonOffsetBasedPaginationSchema = z.object({
  offset: z.coerce.number<number>().optional().default(0),
  limit: z.coerce.number<number>().optional().default(100),
  total: z.coerce.number<number>().optional().default(0),
});

export const ForExtendCommonOffsetBasedPaginationSchema = z.object({
  pagination: CommonOffsetBasedPaginationSchema.optional().default({
    limit: 100,
    offset: 0,
    total: 0,
  }),
});
