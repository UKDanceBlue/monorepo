// import type {
//   // CreateEventBody,
//   // EventResourceInitializer,
//   // GetEventParams,
//   // ListEventsQuery,
//   // PlainImage,
// } from "@ukdanceblue/common";
// import joi from "joi";
// import { DateTime, Duration } from "luxon";

// import { ParsingError } from "../lib/CustomErrors.js";
// import { logWarning } from "../logger.js";

// import {
//   makeFilterOptionsSchema,
//   paginationOptionsSchema,
//   sortingOptionsSchema,
// } from "./Query.js";
// import { makeValidator } from "./makeValidator.js";

// const createEventBodySchema: joi.StrictSchemaMap<CreateEventBody> = {
//   images: joi
//     .alternatives(
//       joi
//         .array()
//         .items(joi.string().uuid({ version: "uuidv4" }))
//         .default([]),
//       joi.array().items(joi.object()).forbidden()
//     )
//     .messages({
//       "alternatives.types": "images must be an array of UUIDs",
//     })
//     .optional(),
//   title: joi.string().required(),
//   summary: joi.string().optional().max(100),
//   description: joi.string().optional(),
//   location: joi.string().optional(),
//   occurrences: joi.array().items(joi.string().isoDate()).default([]),
//   duration: joi.string().isoDuration().optional(),
// };

// const createEventBodyValidator = makeValidator<CreateEventBody>(
//   joi.object<CreateEventBody, true, CreateEventBody>(createEventBodySchema)
// );

// /**
//  * Parses the body of a new event request. Uses Joi to validate the body
//  * and throw an error if it is invalid. Then it converts the start and end
//  * date times to a Luxon Interval. If either is invalid, it will throw an
//  * error. If everything is valid, it returns the parsed body.
//  *
//  * @param body The body of the request
//  * @return The parsed body
//  * @throws An error if the body is invalid
//  * @throws An error if the start or end date time is invalid
//  */
// export function parseCreateEventBody(
//   body: unknown
// ): Omit<EventResourceInitializer, "eventId"> {
//   const { value: eventBody, warning } = createEventBodyValidator(body);

//   if (warning) {
//     logWarning("Error parsing new event body: %s", warning.annotate());
//   }

//   if (!eventBody) {
//     throw new ParsingError("Invalid event body");
//   }

//   const parsedBody: Omit<EventResourceInitializer, "eventId"> = {
//     title: eventBody.title,
//     occurrences: eventBody.occurrences.map((occurrence) =>
//       DateTime.fromISO(occurrence)
//     ),
//     description: eventBody.description ?? null,
//     duration: eventBody.duration ? Duration.fromISO(eventBody.duration) : null,
//     summary: eventBody.summary ?? null,
//     images:
//       (eventBody.images) ??
//       null,
//   };

//   return parsedBody;
// }

// const listEventsQuerySchema = joi
//   .object<ListEventsQuery>({})
//   .keys(paginationOptionsSchema)
//   .keys(sortingOptionsSchema)
//   .keys(
//     makeFilterOptionsSchema(
//       [
//         "eventTitle",
//         "eventSummary",
//         "eventDescription",
//         "eventAddress",
//         "eventOccurrences",
//       ],
//       [
//         ["eventTitle", joi.string()],
//         ["eventSummary", joi.string()],
//         ["eventDescription", joi.string()],
//         ["eventAddress", joi.string()],
//         [
//           "eventOccurrences",
//           joi.array().items(joi.string().isoDate()).default([]),
//         ],
//       ]
//     )
//   );

// const listEventsQueryValidator = makeValidator<ListEventsQuery>(
//   listEventsQuerySchema
// );

// /**
//  * Parses the query of a list s request. Uses Joi to validate the query
//  * and throw an error if it is invalid. If everything is valid, it returns
//  * the parsed query.
//  *
//  * @param query The query of the request
//  * @return The parsed query
//  * @throws An error if the query is invalid
//  */
// export function parseListEventsQuery(query: unknown): ListEventsQuery {
//   const { value: parsedQuery, warning } = listEventsQueryValidator(query);

//   if (warning) {
//     logWarning("Error parsing list s query: %s", warning.annotate());
//   }

//   if (!parsedQuery) {
//     throw new ParsingError("Invalid list s query");
//   }

//   return parsedQuery;
// }

// const getEventParamsSchema = joi.object<GetEventParams>({
//   eventId: joi.string().uuid({ version: "uuidv4" }).required(),
// });

// const singleEventParamsValidator =
//   makeValidator<GetEventParams>(getEventParamsSchema);

// /**
//  * Parses the params of a get event request. Uses Joi to validate the params
//  *
//  * @param params The params of the request
//  * @return The parsed params
//  * @throws An error if the params are invalid
//  */
// export function parseSingleEventParams(params: unknown): GetEventParams {
//   const { value: parsedParams, warning } = singleEventParamsValidator(params);

//   if (warning) {
//     logWarning("Error parsing get event params: %s", warning.annotate());
//   }

//   if (!parsedParams) {
//     throw new ParsingError("Invalid get event params");
//   }

//   return parsedParams;
// }
