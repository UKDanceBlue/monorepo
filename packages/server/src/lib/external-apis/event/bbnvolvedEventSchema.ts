import { DateTime } from "luxon";
import { z } from "zod";

const eventSchema = z.object({
  id: z.string(),
  institutionId: z.number(),
  organizationId: z.number(),
  organizationIds: z.array(z.string()),
  branchId: z.number(),
  branchIds: z.array(z.string()),
  organizationName: z.string(),
  organizationProfilePicture: z.string(),
  organizationNames: z.array(z.string()),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  startsOn: z.string().transform((value) => DateTime.fromISO(value)),
  endsOn: z.string().transform((value) => DateTime.fromISO(value)),
  imagePath: z.string().nullable(),
  theme: z.string(),
  categoryIds: z.array(z.string()),
  categoryNames: z.array(z.string()),
  benefitNames: z.array(z.string()),
  visibility: z.string(),
  status: z.string(),
  latitude: z.string().nullable(),
  longitude: z.string().nullable(),
});

export const bbnvolvedEventSchema = z.object({
  // "@odata.count": z.number(),
  // "@search.coverage": z.null(),
  // "@search.facets": z.object({
  //   CategoryIds: z.array(
  //     z.object({
  //       type: z.number(),
  //       from: z.null(),
  //       to: z.null(),
  //       value: z.string(),
  //       count: z.number(),
  //     })
  //   ),
  //   BranchId: z.array(
  //     z.object({
  //       type: z.number(),
  //       from: z.null(),
  //       to: z.null(),
  //       value: z.number(),
  //       count: z.number(),
  //     })
  //   ),
  //   Theme: z.array(
  //     z.object({
  //       type: z.number(),
  //       from: z.null(),
  //       to: z.null(),
  //       value: z.string(),
  //       count: z.number(),
  //     })
  //   ),
  //   BenefitNames: z.array(
  //     z.object({
  //       type: z.number(),
  //       from: z.null(),
  //       to: z.null(),
  //       value: z.string(),
  //       count: z.number(),
  //     })
  //   ),
  // }),
  value: z.array(eventSchema),
});
