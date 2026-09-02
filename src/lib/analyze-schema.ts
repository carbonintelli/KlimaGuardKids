import { z } from "zod";

/** Shared Zod schema for POST /api/analyze — kept separate for unit tests. */
export const analyzeBodySchema = z
  .object({
    countryCode: z.string().length(2),
    country: z.string().min(1).max(120).optional(),
    cityId: z.string().optional(),
    lat: z.number().min(-90).max(90).optional(),
    lon: z.number().min(-180).max(180).optional(),
    city: z.string().min(1).max(120).optional(),
    regionId: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    const hasCoords =
      typeof val.lat === "number" &&
      typeof val.lon === "number" &&
      Boolean(val.city);
    const hasPreset = Boolean(val.cityId) || Boolean(val.regionId);
    if (!hasCoords && !hasPreset) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide cityId/regionId or city+lat+lon",
      });
    }
  });

export type AnalyzeBody = z.infer<typeof analyzeBodySchema>;
