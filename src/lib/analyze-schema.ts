import { z } from "zod";

/** Shared Zod schema for POST /api/analyze — kept separate for unit tests. */
export const analyzeBodySchema = z.object({
  countryCode: z.string().length(2),
  cityId: z.string().optional(),
  lat: z.number().optional(),
  lon: z.number().optional(),
  city: z.string().optional(),
  regionId: z.string().optional(),
});

export type AnalyzeBody = z.infer<typeof analyzeBodySchema>;
